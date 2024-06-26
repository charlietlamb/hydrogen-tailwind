import {ProductFragment, ProductVariantsQuery} from 'storefrontapi.generated';
import {ProductPrice} from './ProductPrice';
import {Suspense} from 'react';
import {ProductForm} from './ProductForm';
import {Await} from '@remix-run/react';

export function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="lg:flex-row lg:justify-between lg:items-center flex flex-col">
        <h1 className="text-4xl font-bold">{title}</h1>
        <ProductPrice selectedVariant={selectedVariant} />
      </div>
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Description</p>
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </div>
    </div>
  );
}
