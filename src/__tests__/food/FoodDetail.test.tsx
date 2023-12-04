import { act, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FoodDetail from '../../views/food/components/food-detail/FoodDetail';

describe('Create Food', () => {
  it('submits the form correctly', async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <FoodDetail />
      </BrowserRouter>,
    );

    const nameInput = getByTestId('name-input');
    const quantityInput = getByTestId('quantity-input');

    await act(async () => {
      fireEvent.change(nameInput, {
        target: { value: 'Apple' },
      });
      fireEvent.change(quantityInput, {
        target: { value: 10 },
      });
    });
    expect(nameInput).toHaveValue('Apple');
    expect(quantityInput).toHaveValue('10');
  });
});
