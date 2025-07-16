"use client";
import UnauthorizedComponent from "@/components/unauthorized";
import { UnauthorizedException } from "@/constants/error.constants";
import React from "react";

const Error = ({ error }: { error: Error }) => {
  if (error.name == UnauthorizedException.name) {
    return <UnauthorizedComponent />;
  }
  return <div>Error</div>;
};

export default Error;
