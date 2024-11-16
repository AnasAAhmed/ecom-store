import ProductCard from '@/components/product/ProductCard';
import PaginationControls from '@/components/ui/PaginationControls';
import { getSearchProducts } from '@/lib/actions/actions';
import type { Metadata } from 'next';
import Sort from '@/components/Sort';

export const metadata: Metadata = {
  title: "Borcelle | Shop",
  description: "Borcelle Shop where you can search all products",
};

const SearchPage = async ({ searchParams }: { searchParams: any }) => {
  const query = (searchParams?.query as string) || '';
  const sort = (searchParams?.order as string) || '';
  const sortField = (searchParams?.field as string) || '';
  let page = Number(searchParams?.page) || 1;

  const data = await getSearchProducts(query, sort, sortField, page);

  return (
    <div className='sm:px-10 px-3 py-8 '>
      {query && <p className='text-heading3-bold my-10'>Search results for {query}</p>}
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
