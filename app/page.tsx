import Image from "next/image";
import Link from "next/link";
import { Header, Footer, SectionTitle, ListingsPreview, Reviews, ContactForm, aboutImage, heroImage } from "@/components/site";

export default function Home() {
  return <><Header /><main>
    <section className="hero"><div className="hero-copy"><h1>Real Estate,<br /><em>Personally</em> Guided.</h1><p>Helping buyers, sellers, and investors move confidently across Dallas–Fort Worth.</p><div className="hero-actions"><Link href="/listings" className="button button-dark">VIEW LISTINGS <span>↗</span></Link><Link href="/contact" className="text-link">WORK WITH KAROL-ANN <span>↗</span></Link></div></div><div className="hero-image"><Image src={heroImage} alt="Karol-Ann Mozjesik" fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div></section>
    <section className="about-section content-width"><div className="about-image"><Image src={aboutImage} alt="Karol-Ann Mozjesik in Dallas-Fort Worth" fill sizes="(max-width: 760px) 100vw, 40vw" /></div><div className="about-copy"><SectionTitle title="About Karol-Ann" /><p>A lifelong Dallas–Fort Worth resident, Karol-Ann Mozjesik combines deep local knowledge with hands-on experience in residential buying, selling, and real-estate investing.</p><p>Her approach brings together thoughtful pricing, targeted marketing, virtual staging, and personal guidance from first conversation through closing.</p><Link href="/about" className="text-link">READ MORE <span>↗</span></Link></div></section>
    <section className="listings-section content-width"><SectionTitle title="Featured Listings" copy="Thoughtfully selected homes across the Dallas–Fort Worth Metroplex." action={<Link href="/listings" className="text-link">VIEW ALL HOMES <span>↗</span></Link>} /><ListingsPreview /></section>
    <section className="reviews-section"><div className="content-width"><SectionTitle title="Client Reviews" copy="The best part of this work is the people I get to guide home." /><Reviews /></div></section>
    <section className="contact-section content-width"><div className="contact-intro"><h2>Work With<br /><em>Karol-Ann</em></h2><p>Whether you are buying, selling, or exploring what is next, start with a conversation.</p><a href="tel:+12146936034" className="text-link">214-693-6034 <span>↗</span></a></div><ContactForm /></section>
  </main><Footer /></>;
}
