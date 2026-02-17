import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4 text-center">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold text-red-600">غير مصرح</h1>
          <p className="text-gray-600">
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </p>
          <Button as={Link} href="/auth/signin" color="primary">
            العودة لتسجيل الدخول
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
