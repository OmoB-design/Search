'use client';

export function SearchFooter() {
  return (
    <div className="
      shrink-0 flex items-center
      px-16 py-10
      bg-surface-dashboard
      border-t-[0.5px] border-surface-stroke
      rounded-bl-5xl rounded-br-5xl
      [filter:drop-shadow(0px_-2px_2px_rgba(243,243,243,0.1))]
    ">
      <div className="flex items-center gap-8">

        {/* Open */}
        <div className="flex items-center gap-4 px-12 py-6 rounded-[8px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.44434 8.66683H11.7777C12.7599 8.66683 13.5554 7.87127 13.5554 6.88905V3.3335" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.22211 4.88867L2.44434 8.66645L6.22211 12.4442" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-caption-2 font-medium leading-tight text-text-heading-02 whitespace-nowrap">
            Open
          </span>
        </div>

        {/* Navigate */}
        <div className="flex items-center gap-4 px-12 py-6 rounded-[8px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 6.5L8 3.5L10.5 6.5" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 9.5L8 12.5L10.5 9.5" stroke="#777777" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-caption-2 font-medium leading-tight text-text-heading-02 whitespace-nowrap">
            Navigate
          </span>
        </div>

        {/* Esc Clear */}
        <div className="flex items-center gap-4 px-12 py-6 rounded-[8px]">
          <span className="text-caption-2 font-medium leading-tight text-text-heading-02 whitespace-nowrap">
            Esc Clear
          </span>
        </div>

      </div>
    </div>
  );
}
