package logger

import (
	"bytes"
	"fmt"
	"os"
	"path"
	"path/filepath"
	"time"

	rotatelogs "github.com/lestrrat/go-file-rotatelogs"
	"github.com/pkg/errors"
	"github.com/rifflock/lfshook"
	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
)

type MyFormatter struct{}

func (m *MyFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	var b *bytes.Buffer
	if entry.Buffer != nil {
		b = entry.Buffer
	} else {
		b = &bytes.Buffer{}
	}

	timestamp := entry.Time.Format("2006-01-02 15:04:05")
	var newLog string

	if entry.HasCaller() {
		fName := filepath.Base(entry.Caller.File)
		// newLog = fmt.Sprintf("[%s] [%s] [%s:%d %s] %s\n",
		// 	timestamp, entry.Level, fName, entry.Caller.Line, entry.Caller.Function, entry.Message)
		newLog = fmt.Sprintf("[%s] [%s] [%s:%d] %s\n",
			timestamp, entry.Level, fName, entry.Caller.Line, entry.Message)
	} else {
		newLog = fmt.Sprintf("[%s] [%s] %s\n", timestamp, entry.Level, entry.Message)
	}

	b.WriteString(newLog)
	return b.Bytes(), nil
}

func init() {
	logPath := "./logs"
	err := os.MkdirAll(logPath, os.ModePerm)
	if err != nil {
		panic("create logPath failed")
	}

	baseLogPath := path.Join(logPath, "engine.log")
	writer, err := rotatelogs.New(
		baseLogPath+".%Y%m%d%H%M",
		rotatelogs.WithLinkName(baseLogPath),
		rotatelogs.WithMaxAge(365*24*time.Hour),
		rotatelogs.WithRotationTime(24*time.Hour),
	)
	if err != nil {
		log.Errorf("config local file system logger error. %v", errors.WithStack(err))
	}

	switch os.Getenv("LOG_LEVEL") {
	case "FATAL":
		log.SetLevel(log.FatalLevel)
	case "ERROR":
		log.SetLevel(log.ErrorLevel)
	case "WARN":
		log.SetLevel(log.WarnLevel)
	case "INFO":
		log.SetLevel(log.InfoLevel)
	case "DEBUG":
		log.SetLevel(log.DebugLevel)
	default:
		log.SetLevel(log.DebugLevel)
	}

	// formatter := &log.TextFormatter{
	// 	FullTimestamp:   true,
	// 	TimestampFormat: "2006-01-02 15:04:05 07:00",
	// }
	formatter := &MyFormatter{}
	log.SetReportCaller(true)
	log.SetFormatter(formatter)
	lfHook := lfshook.NewHook(lfshook.WriterMap{
		log.DebugLevel: writer,
		log.InfoLevel:  writer,
		log.WarnLevel:  writer,
		log.ErrorLevel: writer,
		log.FatalLevel: writer,
		log.PanicLevel: writer,
	}, formatter)
	log.AddHook(lfHook)
}

// func Debugf(format string, v ...interface{}) {
// 	log.Debugf(format, v...)
// }

// func Infof(format string, v ...interface{}) {
// 	log.Infof(format, v...)
// }

// func Errorf(format string, v ...interface{}) {
// 	log.Errorf(format, v...)
// }
