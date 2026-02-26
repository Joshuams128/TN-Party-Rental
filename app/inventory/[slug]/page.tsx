import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, productDetails } from '@/lib/inventory-data';
import { ProductDetailPage } from '@/components/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} | True North Party Rentals`,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
