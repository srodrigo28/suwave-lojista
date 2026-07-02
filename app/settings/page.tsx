import { notFound } from "next/navigation";
import { SellerShell } from "../_components/seller-shell";
import { sellerPages } from "../_components/seller-data";
import { ThemeSwitcher } from "../_components/theme-switcher";

export default function Page() {
  const page = sellerPages.settings;

  if (!page) {
    notFound();
  }

  return <SellerShell extra={<ThemeSwitcher />} page={page} />;
}
