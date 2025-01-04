"use client"

import { siteConfig } from "@/config/site"
import { Building, Link, type LucideIcon, MapPin } from "lucide-react"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"

export default function MadeWith() {
  return (
    <div className="ps-1">
      Made with{" "}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-help">❤️</TooltipTrigger>
          <TooltipContent>Love</TooltipContent>
        </Tooltip>
      </TooltipProvider>{" "}
      by{" "}
      <HoverCard>
        <HoverCardTrigger href={siteConfig.author.url} target="blank" className="hover:text-primary hover:underline">
          Luca Ziegler Félix
        </HoverCardTrigger>
        <HoverCardContent side="top" align="start" className="w-80">
          <div className="flex gap-4">
            <a href={siteConfig.author.github} target="blank" className="mt-1 h-full">
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/61006057?v=4" />
                <AvatarFallback>LF</AvatarFallback>
              </Avatar>
            </a>
            <div className="ml-1">
              <h4 className="text-sm font-semibold">
                <a href={siteConfig.author.github} target="blank" className="hover:text-primary hover:underline">
                  @flixlix
                </a>
              </h4>
              <p className="text-sm">Passionate full-stack software developer, designer and student.</p>
            </div>
          </div>
          <CustomLinksSection />
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

function CustomLinksSection() {
  return (
    <>
      <CustomLink link="https://maps.app.goo.gl/geSf6wxtUyXZyEGHA" Icon={MapPin}>
        Germany
      </CustomLink>
      <CustomLink link="https://hfg-gmuend.de/" Icon={Building}>
        HfG - Schwäbisch Gmünd
      </CustomLink>
      <CustomLink link={siteConfig.author.url} Icon={Link}>
        My Portfolio
      </CustomLink>
    </>
  )
}

function CustomLink({ children, link, Icon }: { children: React.ReactNode; link: string; Icon: LucideIcon }) {
  return (
    <a
      className="flex cursor-pointer items-center py-1 hover:underline"
      href={link}
      target="blank"
      rel="noopener noreferrer"
    >
      <Icon className="mr-1 h-4 w-4 opacity-70" />{" "}
      <span className="flex items-center text-xs text-muted-foreground">{children}</span>
    </a>
  )
}
