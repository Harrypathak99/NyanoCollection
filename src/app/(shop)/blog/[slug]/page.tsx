import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { POSTS, getPost } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  return { title: post?.title ?? "Post not found", description: post?.excerpt };
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page h-96" />}>
      <BlogPost params={params} />
    </Suspense>
  );
}

async function BlogPost({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug);

  return (
    <>
      <PageHeader title={post.title} crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}>
        <p className="mt-3 text-[13px] text-muted">{formatDate(post.date)}</p>
      </PageHeader>
      <article className="container-page max-w-3xl py-12 lg:py-16">
        <div className="relative mb-10 aspect-[16/9] bg-card">
          <Image src={post.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
        <div className="prose-candle">
          {post.body.map((block, i) => (
            <div key={i}>
              {block.heading && <h2>{block.heading}</h2>}
              <p>{block.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-line pt-6">
          <Link href="/blog" className="link-wave !text-[11px]">
            All posts
          </Link>
          <Link href="/shop" className="link-wave !text-[11px]">
            Shop candles
          </Link>
        </div>
        {others.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 text-[22px]">More from the blog</h2>
            <ul className="space-y-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="text-body hover:text-accent">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
