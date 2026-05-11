import Image from "next/image";
import connectToDb from "@/dbconfig/dbconfig";

await connectToDb();

export default function Home() {
  return <>this is the healthcare application</>;
}
