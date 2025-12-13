import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "What is your primary tech stack?",
        answer: "I am technology agnostic but deeply experienced with JavaScript/TypeScript (React, Next.js, Node.js), Python (FastAPI, AI/ML), and systems languages like Rust and Go. I choose the best tool for the specific problem at hand."
    },
    {
        question: "Do you accept freelance or contract work?",
        answer: "Yes, I am open to discussing freelance projects, consultancy, and open-source collaboration opportunities. Feel free to reach out via LinkedIn or email."
    },
    {
        question: "How do you approach open source contributions?",
        answer: "I believe in building sustainable tools that solve real developer pain points. My contributions focus on long-term maintainability, performance, and developer experience."
    },
    {
        question: "Where are you based?",
        answer: "I am based in Madurai, India, but I work with teams and clients globally."
    },
    {
        question: "I tried contacting you but got no response. What should I do?",
        answer: "If I haven't responded, I might be busy with other commitments. If your inquiry is important, please feel free to follow up via email or create an issue in the relevant GitHub repository."
    }
];

export function FAQ() {
    return (
        <section id="faq" className="min-h-[50vh] flex flex-col justify-center py-20 bg-muted/20">
            <div className="container max-w-3xl mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Common questions about my work and availability.</p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                    {faqData.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                
                {/* Schema.org FAQPage structured data JSON-LD */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqData.map(faq => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                            }
                        }))
                    })
                }} />
            </div>
        </section>
    )
}
