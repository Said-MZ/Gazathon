import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import CardWrapper from "./card-wrapper";

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
