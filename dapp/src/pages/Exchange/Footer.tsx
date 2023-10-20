const Footer = () => {
  return (
    <div className="relative bottom-0 mt-0 flex w-full flex-col bg-dark px-6 text-left text-xs md:flex-row md:items-center md:justify-between md:bg-gray-bg md:bg-transparent bg-[#202020]">
      <div className="hidden flex-col gap-y-4 md:flex md:flex-row md:items-center md:gap-y-0 text-gray-400">
        <a
          target="_blank"
          rel=""
          className="mr-8 text-gray-text hover:opacity-80"
          href=""
        >
          Docs
        </a>
        <a className="mr-8 text-gray-text hover:opacity-80" href="/assets">
          Assets
        </a>
      </div>
      <div className="mt-0 flex py-3 md:mt-0 md:items-center md:py-0">
        <div className="mb-4 hidden md:mb-0 md:flex">
          <a href=" " target="_blank" rel="">
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="my-1 mr-8"
            >
              <path
                d="M22 5.9246C21.2645 6.25051 20.4744 6.47071 19.6438 6.57025C20.4911 6.06289 21.1412 5.25782 21.4477 4.29948C20.655 4.76984 19.7768 5.1116 18.8422 5.29481C18.0935 4.49855 17.0277 4 15.8474 4C13.582 4 11.7446 5.8374 11.7446 8.10464C11.7446 8.42526 11.7816 8.73707 11.8503 9.03832C8.43883 8.86656 5.41672 7.23263 3.39258 4.75046C3.04025 5.35823 2.83766 6.06289 2.83766 6.81335C2.83766 8.23677 3.56258 9.4937 4.66273 10.2292C3.98978 10.2072 3.35735 10.0231 2.80419 9.71567V9.76852C2.80419 11.7565 4.21792 13.4151 6.09583 13.7921C5.75055 13.8855 5.38853 13.9348 5.01506 13.9348C4.75081 13.9348 4.49273 13.9102 4.24258 13.8626C4.76491 15.4921 6.27993 16.6795 8.07593 16.7112C6.67101 17.8122 4.90144 18.4684 2.97948 18.4684C2.64829 18.4684 2.3215 18.449 2 18.4112C3.81626 19.5765 5.97252 20.2547 8.28909 20.2547C15.8378 20.2547 19.9644 14.0026 19.9644 8.58029C19.9644 8.40412 19.96 8.2262 19.9521 8.05003C20.7536 7.47045 21.4495 6.74905 21.9982 5.92724L22 5.9246Z"
                fill="white"
              ></path>
            </svg>
          </a>
          <a
            href=""
            target="_blank"
            rel=""
          >
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="my-1 mr-8"
            >
              <path
                d="M13.4093 12.2471C13.4093 15.6973 10.6314 18.4944 7.20454 18.4944C3.77771 18.4944 1 15.6982 1 12.2471C1 8.79604 3.77792 6 7.20454 6C10.6312 6 13.4093 8.79688 13.4093 12.2471ZM20.216 12.2471C20.216 15.4951 18.8269 18.1278 17.1136 18.1278C15.4003 18.1278 14.0112 15.4942 14.0112 12.2471C14.0112 8.99998 15.4003 6.36639 17.1136 6.36639C18.8269 6.36639 20.216 8.99998 20.216 12.2471ZM23 12.2471C23 15.1571 22.5114 17.516 21.9088 17.516C21.3063 17.516 20.8177 15.1563 20.8177 12.2471C20.8177 9.33792 21.3063 6.97822 21.9091 6.97822C22.5118 6.97822 23 9.33729 23 12.2471Z"
                fill="white"
              ></path>
            </svg>
          </a>
          <a
            href=""
            target="_blank"
            rel=""
          >
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="my-1 mr-8"
            >
              <path
                d="M18.8944 4.34399C17.5184 3.71467 16.057 3.256 14.5317 3C14.3397 3.33067 14.1263 3.77866 13.977 4.13067C12.3546 3.89599 10.7439 3.89599 9.14394 4.13067C8.9946 3.77866 8.77059 3.33067 8.58925 3C7.05328 3.256 5.59194 3.71467 4.22555 4.34399C1.46289 8.41865 0.716219 12.3973 1.08955 16.3226C2.92421 17.6559 4.6949 18.4666 6.43463 19C6.86129 18.424 7.2453 17.8053 7.57597 17.1546C6.94663 16.92 6.3493 16.632 5.7733 16.2906C5.92263 16.184 6.07197 16.0667 6.21064 15.9493C9.68796 17.5387 13.4544 17.5387 16.889 15.9493C17.0383 16.0667 17.177 16.184 17.3263 16.2906C16.7503 16.632 16.153 16.92 15.5237 17.1546C15.8543 17.8053 16.2384 18.424 16.665 19C18.4037 18.4666 20.185 17.6559 22.0101 16.3226C22.4687 11.7787 21.2837 7.83202 18.8944 4.34399ZM8.05596 13.9013C7.01061 13.9013 6.15728 12.952 6.15728 11.7893C6.15728 10.6267 6.98928 9.67731 8.05596 9.67731C9.11194 9.67731 9.97591 10.6267 9.95457 11.7893C9.95457 12.952 9.11194 13.9013 8.05596 13.9013ZM15.065 13.9013C14.0197 13.9013 13.1653 12.952 13.1653 11.7893C13.1653 10.6267 13.9983 9.67731 15.065 9.67731C16.121 9.67731 16.985 10.6267 16.9637 11.7893C16.9637 12.952 16.1317 13.9013 15.065 13.9013Z"
                fill="white"
              ></path>
            </svg>
          </a>
          <a href=" " target="_blank" rel="">
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="my-1 mr-8"
            >
              <path
                d="M4.23741 12.4574C9.06923 10.3406 12.2912 8.945 13.9033 8.27074C18.5063 6.34558 19.4627 6.01116 20.0861 6.00012C20.2232 5.99769 20.5298 6.03186 20.7284 6.19389C20.8961 6.33071 20.9422 6.51553 20.9643 6.64524C20.9864 6.77496 21.0139 7.07046 20.992 7.30136C20.7426 9.93675 19.6633 16.3322 19.1142 19.2838C18.8818 20.5328 18.4244 20.9516 17.9815 20.9926C17.0189 21.0816 16.288 20.3529 15.3558 19.7384C13.897 18.7769 13.0729 18.1783 11.6569 17.24C10.0205 16.1556 11.0813 15.5596 12.0139 14.5856C12.258 14.3307 16.4988 10.4519 16.5809 10.1C16.5912 10.056 16.6007 9.89197 16.5038 9.80535C16.4069 9.71873 16.2639 9.74835 16.1606 9.77191C16.0143 9.8053 13.6839 11.3542 9.16938 14.4185C8.5079 14.8753 7.90875 15.0978 7.37193 15.0862C6.78013 15.0733 5.64175 14.7497 4.79548 14.4731C3.75749 14.1338 2.93252 13.9544 3.00436 13.3782C3.04178 13.0781 3.45279 12.7712 4.23741 12.4574Z"
                fill="white"
              ></path>
            </svg>
          </a>
        </div>

        <div className="md:justify-start mr-4 items-center justify-center text-[14px] text-gray-text flex md:hidden">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M3 19V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H13C13.2652 3 13.5196 3.10536 13.7071 3.29289C13.8946 3.48043 14 3.73478 14 4V12H16C16.5304 12 17.0391 12.2107 17.4142 12.5858C17.7893 12.9609 18 13.4696 18 14V18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18V11H18C17.7348 11 17.4804 10.8946 17.2929 10.7071C17.1054 10.5196 17 10.2652 17 10V6.414L15.343 4.757L16.757 3.343L21.707 8.293C21.8 8.38574 21.8738 8.49594 21.924 8.61727C21.9743 8.7386 22.0001 8.86866 22 9V18C22 18.7956 21.6839 19.5587 21.1213 20.1213C20.5587 20.6839 19.7956 21 19 21C18.2044 21 17.4413 20.6839 16.8787 20.1213C16.3161 19.5587 16 18.7956 16 18V14H14V19H15V21H2V19H3ZM5 5V11H12V5H5Z"
              fill="#87868B"
            ></path>
          </svg>
          <span> </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;