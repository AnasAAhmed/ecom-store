import FadeInOnView from "../FadeInView";
import ProductCard from "./ProductCard";
import SmartLink from "@/components/SmartLink";

const ProductList = async ({ Products, heading, isViewAll = true }: { Products: ProductType[], heading?: string; isViewAll?: boolean }) => {

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-3 sm:px-5">
      {heading &&
          <p className="text-heading3-bold sm:text-heading2-bold capitalize">{heading}</p>
        }

      {!Products || Products.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10">
          {Products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {Products.length > 4 && isViewAll && <div className="self-stretch flex flex-row items-start justify-center py-[0rem] px-[1.25rem]">
        <div className="w-[12.875rem] flex flex-col items-start justify-start ">
          <FadeInOnView delay={300} threshold={0.5} animation="animate-fadeIn">
            <SmartLink prefetch={false} title=" View All Products" href="/search" className="h-[1.875rem] mx-auto relative font-medium inline-block z-[1] text-heading4-bold">
              View All Products
            </SmartLink>
            <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.187rem] pl-[0.375rem]">
              <div className="h-[0.125rem] flex-1 relative box-border z-[1] border-t-[2px] border-solid border-black" />
            </div>
          </FadeInOnView>
        </div>
      </div>}
    </div>
  );
};

export default ProductList;
