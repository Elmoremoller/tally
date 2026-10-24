import Link from "next/link";
import { offer } from "@/lib/offer";
import { Wordmark } from "./brand/Logo";

export function SiteFooter() {
  return (
    <footer className="footer" data-section="footer">
      <div className="wrap">
        <div className="footer-row">
          <nav aria-label="Footer">
            <ul className="footer-links">
              <li>
                <Link href="/login">{offer.login}</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Wordmark className="footer-wordmark" title={offer.name} />
      </div>
    </footer>
  );
}
