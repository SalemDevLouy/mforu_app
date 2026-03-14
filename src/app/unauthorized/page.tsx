"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { HiNoSymbol } from "react-icons/hi2";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4 text-center">
          <div className="flex justify-center"><HiNoSymbol className="text-6xl text-danger" /></div>
          <h1 className="text-2xl font-bold text-red-600">غير مصرح</h1>
          <p className="text-gray-600">
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>
          <Button 
            onPress={() => {
              router.back();
              setTimeout(() => router.back(), 100);
            }} 
            color="primary"
          >
            العودة للصفحة السابقة
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
