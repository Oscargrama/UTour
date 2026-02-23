import Image from "next/image"

type SecurePaymentsBadgeProps = {
  className?: string
}

export function SecurePaymentsBadge({ className = "" }: SecurePaymentsBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-[#d6e4ff] bg-white px-4 py-2 text-sm font-semibold text-[#1f3684] ${className}`}
    >
      <span className="text-[#42527f]">Pagos seguros con</span>
      <Image
        src="/mercado-pago-logo.png"
        alt="Mercado Pago"
        width={120}
        height={30}
        className="h-6 w-auto"
      />
    </div>
  )
}
