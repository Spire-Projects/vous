import { redirect } from "next/navigation";

export default async function CatalogoProductoPage(props: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(props.params);
  redirect(`/producto/${slug}`);
}
