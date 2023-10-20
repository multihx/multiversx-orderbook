import type { PropsWithChildren } from 'react';

export const PageWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-1 bg-[#171717] p-6 sm:flex-row items-center justify-center'>
      {children}
    </div>
  );
};
