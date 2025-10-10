import { Power, User } from "lucide-react";
import { SearchComponent } from "../shared/searchComponent";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { ThemeToggle } from "./themeToggle";
import { logoutService } from "@supervisor/services/Auth/authenticate";

const TopBarComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="fixed right-0 gap-4 m-2 h-10 w-full bg-background z-10 flex items-center md:justify-end ">
        {isMobile && (
          <Image
            src="/logo.png"
            alt="logo"
            className=" ml-4"
            width={20}
            height={20}
          />
        )}
        <SearchComponent className="flex gap-4 w-full  md:w-1/4" />
        
        <div className="">
          <ThemeToggle  /> {/* <-- BOTÃO DE TEMA AQUI */}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="h-9 w-9">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User />
              Conta
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logoutService()}>
              <Power />
              Logout{" "}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
};

export default TopBarComponent;
