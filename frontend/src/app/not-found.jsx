import { Button } from "@mui/material";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen not-found">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-9xl text-[var(--primary-color)]">404</h1>
        <p className="text-3xl font-semibold text-[var(--black-color)]">
          OPPS! PAGE NOT FOUND
        </p>
        <Link href={"/"}>
          <Button className="bg-[var(--primary-color)] text-white">
            GO HOME
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
