import { ReactNode } from "react";
import { Button } from "@supervisor/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@supervisor/components/ui/card";

interface PropsCard {
  title: string;
  description: string;
  titleButton: string;
  icon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
}

const CardInfoButton = ({
  title,
  description,
  titleButton,
  icon,
  onClick,
  children
}: PropsCard) => {
  return (
    <Card className="flex flex-col justify-between h-64">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">{children}</CardContent>

      <CardFooter className="pt-0 flex justify-center">
        <Button className="flex items-center gap-2" onClick={onClick}>
          {titleButton}
          {icon}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardInfoButton