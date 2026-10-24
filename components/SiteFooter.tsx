import Link from "next/link";
import { Wordmark } from "./brand/Logo";

export function SiteFooter() {
  return (
    <footer className="footer" data-section="footer">
      <div className="wrap">
        <div className="footer-row">
          <p>Not therapy. Made for everyday arguments.</p>
          <nav aria-label="Legal">
            <ul className="footer-links">
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Wordmark className="footer-wordmark" title="The Couple Standard" />
      </div>
    </footer>
  );
}
