
import { cache } from 'react';
import { getCollectionDetails  } from './collection.actions';
import { getProductDetails } from './product.actions';
import { connectToDB } from '../mongoDB';
import HomePage from '../models/HomePage';

 async function getHomePageData(): Promise<HomePage | null> {
    try {
      await connectToDB();

      const homePage = await HomePage.findOne({});
      return homePage;
    } catch (err) {
      console.log("[homePage_GET]", err);
      return null;
    }
  }

export const getCachedHomePageData = cache(getHomePageData);
export const getCachedCollectionDetails = cache(getCollectionDetails);
export const getCachedProductDetails = cache(getProductDetails);
