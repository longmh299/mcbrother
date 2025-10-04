// components/CTA.tsx
const BLUE = "#2653ed";

export default function CTA() {
  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2">
      {/* Hotline */}
      <a href="tel:0834551888" className="group flex items-center" aria-label="Gọi hotline">
        <div className="flex md:hidden items-center justify-center w-12 h-12 rounded-full shadow-lg text-white" style={{ backgroundColor: BLUE }}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 .9v3.5c0 .5-.4 1-1 1A19.5 19.5 0 0 1 2 4c0-.6.5-1 1-1h3.5c.5 0 .9.4.9 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z"/>
          </svg>
        </div>
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white border" style={{ backgroundColor: BLUE, borderColor: BLUE }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 .9v3.5c0 .5-.4 1-1 1A19.5 19.5 0 0 1 2 4c0-.6.5-1 1-1h3.5c.5 0 .9.4.9 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z"/>
          </svg>
          <span className="font-semibold">0834 551 888</span>
        </div>
      </a>

      {/* Zalo chuẩn */}
      <a href="https://zalo.me/0834551888" target="_blank" className="group flex items-center" aria-label="Nhắn Zalo">
        {/* Mobile: tròn 48, dùng logo chuẩn */}
        <div className="flex md:hidden items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white">
          <img src="/images/zalo-logo.png" alt="Zalo" className="w-7 h-7 object-contain" />
        </div>

        {/* MD+: pill + text */}
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white text-[#2653ed] border transition hover:bg-[#f5ed42] hover:text-black" style={{ borderColor: BLUE }}>
          <img src="/images/zalo-logo.png" alt="Zalo" className="w-5 h-5 object-contain" />
          <span className="font-semibold">Zalo</span>
        </div>
      </a>
    </div>
  );
}
