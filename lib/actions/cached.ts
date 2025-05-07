
import { cache } from 'react';
import { getCollectionDetails  } from './collection.actions';
import { getProductDetails } from './product.actions';

export const getCachedCollectionDetails = cache(getCollectionDetails);
export const getCachedProductDetails = cache(getProductDetails);
