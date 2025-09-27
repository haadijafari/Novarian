import { ChatContainer, MessageBubble } from "@/components/products/product-detail/customer-reviews"

export default function DiscussionModal() {
  return (
    <ChatContainer className="bg-surface-muted order-2 h-full border-active-muted rounded-2xl">
      <MessageBubble incoming>
        سلام، این کفش‌ها موجود هستن؟
      </MessageBubble>
      <MessageBubble>
        سلام بله، در سایز ۴۰ تا ۴۴ موجود داریم.
      </MessageBubble>
      <MessageBubble incoming>
        قیمتش چند هست؟
      </MessageBubble>
      <MessageBubble>
        ۱,۲۰۰,۰۰۰ تومن، با ارسال رایگان.
      </MessageBubble>
      <MessageBubble>
        جنس رویه چرم مصنوعی هست و کفی طبی داره.
      </MessageBubble>
      <MessageBubble incoming>
        چه رنگ‌هایی موجود دارین؟
      </MessageBubble>
      <MessageBubble>
        مشکی، سفید و سرمه‌ای موجوده. کدوم رنگ رو می‌خواین؟
      </MessageBubble>
    </ChatContainer>
  )
}
