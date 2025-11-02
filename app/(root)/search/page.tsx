import ProductCard from '@/components/product/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import { getSearchProducts } from '@/lib/actions/product.actions';
import Sort from '@/components/Sort';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import ProductList from '@/components/product/ProductList';
import FilterBadges from '@/components/ui/FiltersUi';


export async function generateMetadata(props: { searchParams: Promise<{ query: string }> }) {
  const searchParams = await props.searchParams;
  return {
    title: `Search ${searchParams.query ? 'results for: ' + searchParams.query : ''} | Borcelle`,
    description: "Search high-quality products at Borcelle.",
    keywords: ['search', "products", 'Borcelle'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `Search ${searchParams.query ? 'results for "' + searchParams.query : ''}" | Borcelle`,
      description: "Search high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_URL}/search`,
      images: [
        {
          url: '/home-insights.webp',
          width: 220,
          height: 250,
          alt: 'insights',
        },
      ],
      site_name: 'Borcelle',
    },
  };
}


const SearchPage = async (props: { searchParams: Promise<any> }) => {
  const searchParams = await props.searchParams;
  const query = (searchParams?.query as string) || '';
  const color = (searchParams?.color as string) || '';
  const size = (searchParams?.size as string) || '';
  const sort = (searchParams?.order as string) || '';
  const category = (searchParams?.category as string) || '';
  const sortField = (searchParams?.field as string) || '';
  let page = Number(searchParams?.page) || 1;

  const isDefault =
    (!query || query.trim() === "") &&
    (!sort || sort === "") &&
    (!sortField || sortField === "") &&
    (!category || category === "") &&
    (!color || color === "") &&
    (!size || size === "") &&
    page === 1;

  let data;

  if (isDefault) {
    const getCachedSearchProducts = unstable_cache(
      async () => {
        return await getSearchProducts(query, sort, sortField, page, category, color, size);
      },
      ["search-default"],
      { revalidate: 604800, tags: ["search-default"] } // 7 day cache
    );

    data = await getCachedSearchProducts();
  }

  // For all other queries: bypass cache
  data = await getSearchProducts(query, sort, sortField, page, category, color, size);

  return (
    <div className='sm:px-10  mt-[2.5rem] md:mt-16 px-3 py-12 '>
      <Sort />
      <div className='min-h-[80vh]'>
      <FilterBadges/>
        <ProductList isCsr isViewAll={false} Products={data.products} />
      </div>
      <PaginationControls currentPage={page} totalPages={data.totalPages} />
    </div>
  );
};

export default SearchPage;
