import ProductCard from '@/components/product/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import { getSearchProducts } from '@/lib/actions/product.actions';
import Sort from '@/components/Sort';
import Link from 'next/link';

export async function generateMetadata({ searchParams }: { searchParams: { query: string } }) {
  return {
    title: `Search ${searchParams.query?'results for '+searchParams.query:''} | Borcelle`,
    description: "Search high-quality products at Borcelle.",
    keywords: ['search',"products",'Borcelle'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `Search | Borcelle`,
      description: "Search high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_URL}/search`,
      images: [
        {
          url: '/home-preview.avif',
          width: 220,
          height: 250,
          alt: 'hero banner',
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
    },
  };
}


const SearchPage = async ({ searchParams }: { searchParams: any }) => {
  const query = (searchParams?.query as string) || '';
  const color = (searchParams?.color as string) || '';
  const size = (searchParams?.size as string) || '';
  const sort = (searchParams?.order as string) || '';
  const category = (searchParams?.category as string) || '';
  const sortField = (searchParams?.field as string) || '';
  let page = Number(searchParams?.page) || 1;

  const data = await getSearchProducts(query, sort, sortField, page, category, color,size);

  return (
    <div className='sm:px-10 px-3 py-8 '>
      {query && <p className='text-small-medium md:text-body-medium lg:text-heading3-bold my-10'>Search results for {query} <Link className='underline text-small-medium text-blue-500' title='Clear filters' href={'/search'}>Clear &times;</Link></p>}
      <Sort />
      <div className='min-h-[80vh]'>

        {data.totalProducts > 0 ? (
          <div className="grid grid-cols-2 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

            {data.products.map((product: ProductType) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className='text-body-bold my-5'>No result found</p>
        )}
      </div>
      <PaginationControls currentPage={page} totalPages={data.totalPages} />
    </div>
  );
};

export default SearchPage;
