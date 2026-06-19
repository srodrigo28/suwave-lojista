import { notFound } from "next/navigation";
import { SellerShell } from "./seller-shell";
import { sellerPages } from "./seller-data";

export function SellerStaticPage({ pageId }: { pageId: string }) {
  const page = sellerPages[pageId];

  if (!page) {
    notFound();
  }

  return <SellerShell page={page} />;
}
