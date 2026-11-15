import { AutoComplete, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';

import { ProductType } from '@enums';
import { Product } from '@interfaces';
import { ProductService } from '@services';

const { Text } = Typography;

const SEARCH_DEBOUNCE_MS = 300;

interface ProductSearchProps {
  type: ProductType;
  onSelect: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ type, onSelect }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search$] = useState(() => new Subject<string>());

  useEffect(() => {
    const subscription = search$
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        switchMap((q) =>
          q
            ? ProductService.searchProducts(type, q).pipe(
                catchError(() => of<Product[]>([])),
              )
            : of<Product[]>([]),
        ),
      )
      .subscribe((result) => {
        setProducts(result);
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, [search$, type]);

  const onSearch = (text: string) => {
    const q = text.trim();
    if (!q) {
      setProducts([]);
      setLoading(false);
    } else {
      setLoading(true);
    }
    search$.next(q);
  };

  const onProductSelect = (value: string) => {
    const product = products.find((p) => String(p.id) === value);
    setSearchText('');
    setProducts([]);
    if (product) {
      onSelect(product);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Keep Enter from submitting the surrounding form.
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const options = products.map((product) => {
    const details = [product.brand, product.barcode]
      .filter(Boolean)
      .join(' · ');
    return {
      value: String(product.id),
      label: (
        <div>
          <div>{product.name}</div>
          {details && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {details}
            </Text>
          )}
        </div>
      ),
    };
  });

  const showNotFound = searchText.trim() !== '' && !loading;

  return (
    <AutoComplete
      value={searchText}
      options={options}
      filterOption={false}
      onChange={setSearchText}
      onSearch={onSearch}
      onSelect={onProductSelect}
      notFoundContent={showNotFound ? 'ไม่พบสินค้า' : null}
    >
      <Input.Search
        data-testid="product-search-input"
        placeholder="ค้นหาด้วยชื่อหรือบาร์โค้ด"
        loading={loading}
        allowClear
        onKeyDown={onKeyDown}
      />
    </AutoComplete>
  );
};

export default ProductSearch;
