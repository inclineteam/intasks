import { component$ } from "@builder.io/qwik";
import { SidebarLink } from "./link";
import { useUser } from "~/routes/plugin@auth";
import {
  LuBell,
  LuCheckSquare,
  LuChevronDown,
  LuFolder,
  LuHome,
  LuMail,
} from "@qwikest/icons/lucide";
import Logo from "../../../public/logo.svg?jsx";
import { Button } from "../button";

export const Sidebar = component$(() => {
  const links = [
    {
      icon: LuHome,
      link: "/dashboard/",
      name: "Dashboard",
    },
    {
      icon: LuFolder,
      link: "/projects/",
      name: "Projects",
    },
    {
      icon: LuCheckSquare,
      link: "/tasks/",
      name: "Tasks",
    },
    {
      icon: LuBell,
      link: "/notifications/",
      name: "Notifications",
    },
    {
      icon: LuMail,
      link: "/invitations/",
      name: "Invitations",
    },
  ];
  const profile = useUser();

  return (
    <div class="sticky top-0 flex h-screen min-w-[18rem] flex-col px-10 pt-10">
      <header class="flex space-x-2">
        <Logo class="h-8 w-8" />
        <p class="text-2xl font-bold tracking-tight text-zinc-800">Intasks</p>
      </header>

      <hr class="my-8" />

      <div class="flex flex-1 flex-col justify-between">
        <nav>
          <div class="mb-6 flex items-center space-x-2">
            <div class="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
            <div class="text-sm">
              <p class="font-semibold leading-none">
                {profile.value?.firstname} {profile.value?.lastname}
              </p>
              <p class="text-zinc-500">@{profile.value?.username}</p>
            </div>
          </div>

          <ul class="space-y-2">
            {links.map((link, i) => (
              <SidebarLink key={i} link={link.link} name={link.name}>
                <link.icon class="h-5 w-5" />
              </SidebarLink>
            ))}
          </ul>
        </nav>

        <div>
          <Button variant="secondary" class="mb-4 justify-between">
            <div class="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-600"></div>
            <span>Switch account</span>
            <LuChevronDown />
          </Button>
        </div>
      </div>
    </div>
  );
});
