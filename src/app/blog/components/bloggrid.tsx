import Image from "next/image";
import Link from "next/link";
import { posts } from "../data/posts";

export default function BlogGrid() {
  return (
    <section className="bg-white pb-32">
      <div className="container mx-auto px-6 lg:max-w-screen-xl">

        <span className="section-eyebrow">
          My Blog
        </span>

        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              
              {/* Image */}
              <div className="relative h-[220px] mb-8 overflow-hidden rounded-xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <time className="block text-xs text-black/50 mb-3">
                {post.date}
              </time>

              <h3 className="text-xl font-semibold leading-snug text-black mb-5 group-hover:text-[#5f3b86] transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="text-sm text-black/70 leading-relaxed mb-8">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="text-xs uppercase tracking-[0.25em] text-black/70 hover:text-black transition"
              >
                Continue Reading →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
