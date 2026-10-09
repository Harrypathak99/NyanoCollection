import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { POSTS } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Blog" }]} />
      <section className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:py-20">
        {POSTS.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="relative mb-5 block aspect-[4/3] overflow-hidden bg-card">
              <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </Link>
            <p className="mb-2 text-[12px] uppercase tracking-wider text-muted">{formatDate(post.date)}</p>
            <h2 className="mb-3 text-[22px] leading-snug">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mb-4 text-[14px] leading-relaxed text-body">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="link-wave !text-[11px]">
              Read more
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
