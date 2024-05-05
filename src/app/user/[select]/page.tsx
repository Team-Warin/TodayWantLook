export default function User({ params }: { params: { select: string } }) {
  return <div>{params.select}</div>;
}
