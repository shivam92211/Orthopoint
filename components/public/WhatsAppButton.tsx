import { Button } from "@/components/ui/button";
import { generateWhatsAppLink } from "@/lib/utils";

interface WhatsAppButtonProps {
  instrumentName: string;
  price: number;
  currency: string;
  phoneNumber: string;
}

export default function WhatsAppButton({
  instrumentName,
  price,
  currency,
  phoneNumber,
}: WhatsAppButtonProps) {
  const whatsappUrl = generateWhatsAppLink(
    phoneNumber,
    instrumentName,
    price,
    currency,
    typeof window !== "undefined" ? window.location.href : ""
  );

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg py-6">
        Buy Now
      </Button>
    </a>
  );
}
