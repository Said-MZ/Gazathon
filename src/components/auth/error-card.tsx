import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import CardWrapper from "./card-wrapper";
import Header from "./header";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel={"Oops! Something went wrong..."}
      backButtonLabel={"Back to Login"}
      backButtonHref={"/auth/login"}
    >
      <div className="flex items-center justify-center w-full ">
        <ExclamationTriangleIcon
          className="text-destructive"
          width={30}
          height={30}
        />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
