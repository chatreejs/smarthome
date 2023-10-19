import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FoodDetail = () => {
  const { foodId } = useParams();
  const [foodData, setFoodData] = useState<any>();

  useEffect(() => {
    const loadFoodData = () => {
      console.log('loadFoodData id: ', foodId);
      setFoodData({
        id: foodId,
        name: 'Food Name',
        description: 'Food Description',
      });
    };

    if (foodId) {
      loadFoodData();
    }
  }, [foodId]);

  return (
    <>
      <h1>FoodDetail</h1>
      <p>ID: {foodId}</p>
      <p>Name: {foodData?.name}</p>
      <p>Description: {foodData?.description}</p>
    </>
  );
};

export default FoodDetail;
