'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React from 'react'

const ProductAccordion = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>آیا کفش‌ها سایز استاندارد دارند؟</AccordionTrigger>
        <AccordionContent>
          بله، تمامی کفش‌ها طبق استاندارد جهانی سایزبندی شده‌اند. لطفاً قبل از خرید جدول راهنمای سایز را بررسی کنید.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>اگر سایز کفش مناسب نباشد، امکان تعویض هست؟</AccordionTrigger>
        <AccordionContent>
          بله، تا ۷ روز پس از دریافت سفارش، امکان تعویض سایز وجود دارد؛ فقط کافیست کفش استفاده‌نشده و در بسته‌بندی اصلی باشد.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>جنس رویه و زیره کفش‌ها چیست؟</AccordionTrigger>
        <AccordionContent>
          بسته به مدل، کفش‌ها از جنس چرم طبیعی، چرم مصنوعی یا پارچه‌ای هستند. اطلاعات دقیق در صفحه هر محصول ذکر شده است.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>آیا کفش‌ها مناسب پیاده‌روی طولانی هستند؟</AccordionTrigger>
        <AccordionContent>
          برخی مدل‌ها مخصوص راحتی و استفاده روزمره طراحی شده‌اند. لطفاً به توضیحات هر محصول دقت کنید تا گزینه مناسب را انتخاب کنید.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>آیا امکان مشاهده تصاویر بیشتر یا فیلم کفش‌ها وجود دارد؟</AccordionTrigger>
        <AccordionContent>
          بله، در بخش گالری هر محصول می‌توانید تصاویر کامل و در صورت وجود، ویدیوی معرفی کفش را مشاهده کنید.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ProductAccordion

