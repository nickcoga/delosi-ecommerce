import type { FakeStoreProductDTO } from "@/lib/products/fake-store/dto";
import type { Product } from "@/lib/products/types";

export function toProduct(dto: FakeStoreProductDTO): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    description: dto.description,
    category: dto.category,
    imageUrl: dto.image,
    rating: {
      rate: dto.rating.rate,
      count: dto.rating.count,
    },
  };
}
