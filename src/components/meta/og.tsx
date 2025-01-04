export default function OpengraphImage({ description = "Test" }: { description?: string }) {
  return (
    <div tw="flex bg-white">
      <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2077_2)">
          <rect width="1200" height="630" fill="white" />
          <g opacity="0.2" filter="url(#filter0_ddd_2077_2)">
            <rect x="139" y="160" width="309" height="309" rx="20" fill="white" />
          </g>
          <path
            d="M315.75 242.5H272.25C268.246 242.5 265 245.746 265 249.75V264.25C265 268.254 268.246 271.5 272.25 271.5H315.75C319.754 271.5 323 268.254 323 264.25V249.75C323 245.746 319.754 242.5 315.75 242.5Z"
            stroke="#2563EB"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M323 257H337.5C341.346 257 345.034 258.528 347.753 261.247C350.472 263.966 352 267.654 352 271.5V373C352 376.846 350.472 380.534 347.753 383.253C345.034 385.972 341.346 387.5 337.5 387.5H250.5C246.654 387.5 242.966 385.972 240.247 383.253C237.528 380.534 236 376.846 236 373V271.5C236 267.654 237.528 263.966 240.247 261.247C242.966 258.528 246.654 257 250.5 257H265"
            stroke="#2563EB"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M294 307.75H323" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M294 344H323" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M265 307.75H265.073"
            stroke="#2563EB"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M265 344H265.073" stroke="#2563EB" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <filter
            id="filter0_ddd_2077_2"
            x="-11"
            y="10"
            width="579"
            height="609"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="20" dy="-50" />
            <feGaussianBlur stdDeviation="50" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.847059 0 0 0 0 0.705882 0 0 0 0 0.996078 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2077_2" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-25" dy="50" />
            <feGaussianBlur stdDeviation="50" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.113725 0 0 0 0 0.305882 0 0 0 0 0.847059 0 0 0 0.4 0" />
            <feBlend mode="normal" in2="effect1_dropShadow_2077_2" result="effect2_dropShadow_2077_2" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-50" dy="-20" />
            <feGaussianBlur stdDeviation="50" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.992157 0 0 0 0 0.878431 0 0 0 0 0.278431 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="effect2_dropShadow_2077_2" result="effect3_dropShadow_2077_2" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_2077_2" result="shape" />
          </filter>
          <clipPath id="clip0_2077_2">
            <rect width="1200" height="630" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div tw="flex flex-col absolute left-[550px] inset-y-0 text-black justify-center">
        <h1 tw="text-[64px] mb-2">Next safe email auth</h1>
        <p tw="text-3xl">{description}</p>
      </div>
    </div>
  )
}
