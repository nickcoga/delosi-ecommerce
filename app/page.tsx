import { permanentRedirect } from "next/navigation";

export default function Home(): never {
  permanentRedirect("/products");
}
