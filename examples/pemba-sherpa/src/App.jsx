import { Routes, Route } from "react-router-dom";
import { pages } from "./generated/pages.js";
import PembaShell from "./PembaShell.jsx";
import SubscribeForm from "./SubscribeForm.jsx";
import ContactForm from "./ContactForm.jsx";
import NotFound from "./NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PembaShell />}>
        {pages.map((page) => (
          <Route
            key={page.slug}
            path={page.slug === "index" ? "/" : `/${page.slug}`}
            element={<PageContent page={page} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function PageContent({ page }) {
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
      {page.showSubscribe && (
        <section className="mb-5" id="subscribe">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <SubscribeForm />
            </div>
          </div>
        </section>
      )}
      {page.showContact && (
        <section className="mb-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <ContactForm />
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
