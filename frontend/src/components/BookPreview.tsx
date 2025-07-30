import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book } from "@/types/book";

interface BookPreviewProps {
  book: Book;
  variant?: "button" | "card";
  className?: string;
}

interface PreviewPage {
  id: number;
  content: string;
  contentTelugu?: string;
  pageNumber: number;
}

// Mock preview pages - in real app this would come from book data
const getPreviewPages = (book: Book): PreviewPage[] => {
  const samplePages: PreviewPage[] = [
    {
      id: 1,
      pageNumber: 1,
      content: `Chapter 1: The Beginning

In the heart of Andhra Pradesh, where the Krishna River flows with ancient wisdom, our story begins. The year was 1945, and the freedom struggle was at its peak.

Young Raman looked out of his window at the bustling marketplace below. The aroma of jasmine flowers mixed with the calls of vendors selling fresh vegetables and traditional sweets.

"Education is the key to our liberation," his father had always said, holding up a worn copy of Veyipadagalu. The book had been passed down through generations, its pages yellowed with time but its wisdom eternal.

As Raman picked up his slate and began practicing his Telugu letters, he could hear his grandmother's voice from the kitchen, humming an old folk song. The melody carried stories of brave warriors, wise sages, and the undying spirit of his people.`,
      contentTelugu: `అధ్యాయం 1: ప్రారంభం

కృష్ణా నది పురాతన జ్ఞానంతో ప్రవహించే ఆంధ్రప్రదేశ్ హృదయంలో, మా కథ ప్రారంభమవుతుంది. 1945 సంవత్సరం, స్వాతంత్ర్య పోరాటం గరిష్ట స్థాయిలో ఉంది.

యువ రామన్ తన కిటికీ నుండి కింద రద్దీగా ఉన్న మార్కెట్‌ని చూశాడు. మల్లెల పువ్వుల సువాసన తాజా కూరగాయలు మరియు సాంప్రదాయ స్వీట్లు అమ్మే వ్యాపారుల కూతలతో కలిసిపోయింది.

"విద్య మన విముక్��ికి కీలకం" అని అతని తండ్రి ఎల్లప్పుడూ చెప్పేవాడు, వేయిపదగలు యొక్క అరిగిన కాపీని పట్టుకుని. ఆ పుస్తకం తరతరాలుగా అందించబడింది, దాని పేజీలు కాలంతో పసుపు రంగులోకి మారాయి కానీ దాని జ్ఞానం శాశ్వతమైనది.`,
    },
    {
      id: 2,
      pageNumber: 15,
      content: `Chapter 3: The Festival

The village came alive during Ugadi. Colorful rangoli patterns adorned every doorstep, and the sound of drums echoed through the narrow lanes. Children ran between houses, their new clothes bright as the morning sun.

Raman's mother prepared the traditional Ugadi pachadi, carefully balancing the six tastes that represent life's experiences - sweet jaggery for happiness, sour tamarind for challenges, bitter neem for difficulties, salt for tears, spicy chili for anger, and astringent raw mango for surprise.

"Life is like this pachadi," she explained to Raman as he watched her mix the ingredients. "It has all tastes, and we must accept them all with grace."

The temple bells rang in the distance, calling everyone for the special prayers. As the family walked together toward the ancient temple, Raman felt connected to something larger than himself - a culture, a tradition, a way of life that had sustained his people for centuries.`,
      contentTelugu: `అధ్యాయం 3: పండుగ

ఉగాది సమయంలో గ్రామం జీవంతమైంది. రంగురంగుల రంగోలీ నమూనాలు ప్రతి గుమ్మంలో అలంకరించబడ్డాయి, మరియు డోలుల ధ్వని ఇరుకైన లేన్లలో ప్రతిధ్వనించింది. పిల్లలు ఇళ్ల మధ్య పరిగెత్తారు, వారి కొత్త బట్టలు ఉదయ సూర్యుడిలా ప్రకాశవంతంగా ఉన్నాయి.

రామన్ తల్లి సాంప్రదాయిక ఉగాది పచ్చడిని తయారు చేసింది, జీవిత అనుభవాలను సూచించే ఆరు రుచులను జాగ్రత్తగా సమతుల్యం చేసింది - ఆనందం కోసం తీపి బెల్లం, సవాళ్ల కోసం పుల్లని చింతపండు, కష్టాల కోసం చేదు వేప, కన్నీళ్ల కోసం ఉప్పు, కోపం కోసం మసాలా మిర్చి, మరియు ఆశ్చర్యం కోసం గాఢమైన పచ్చి మామిడి.

"జీవితం ఈ పచ్చడి లాంటిది," ఆమె రామన్‌కు వివరించింది, అతను ఆమె పదార్థాలను కలపడం చూస్తున్నప్పుడు. "దీనికి అన్ని రుచులు ఉన్నాయి, మరియు మనం వాటన్నింటినీ దయతో అంగీకరించాలి."`,
    },
  ];

  return samplePages;
};

export function BookPreview({
  book,
  variant = "button",
  className = "",
}: BookPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTelugu, setShowTelugu] = useState(false);

  const previewPages = getPreviewPages(book);

  if (previewPages.length === 0) return null;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % previewPages.length);
  };

  const prevPage = () => {
    setCurrentPage(
      (prev) => (prev - 1 + previewPages.length) % previewPages.length,
    );
  };

  const currentPageData = previewPages[currentPage];

  if (variant === "card") {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Book Preview</h4>
            </div>
            <Badge variant="outline" className="text-xs">
              {previewPages.length} pages
            </Badge>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Get a glimpse inside this book with sample pages
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Preview: {book.title}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTelugu(!showTelugu)}
                    >
                      {showTelugu ? "English" : "తెలుగు"}
                    </Button>
                    <span className="text-sm text-gray-500">
                      Page {currentPageData.pageNumber}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <div className="relative h-[60vh] bg-gray-50 rounded-lg p-8 overflow-y-auto">
                  <div className="max-w-2xl mx-auto">
                    <div
                      className={`prose prose-sm ${showTelugu ? "telugu-text" : ""} max-w-none`}
                    >
                      {showTelugu && currentPageData.contentTelugu
                        ? currentPageData.contentTelugu
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index} className="mb-4 leading-relaxed">
                                {paragraph}
                              </p>
                            ))
                        : currentPageData.content
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index} className="mb-4 leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={previewPages.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    {previewPages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentPage
                            ? "bg-blue-600"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={previewPages.length <= 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    Enjoying this preview?
                  </p>
                  <Button className="w-full">
                    Buy Complete Book - ₹{book.price}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Button variant
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview: {book.title}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTelugu(!showTelugu)}
              >
                {showTelugu ? "English" : "తెలుగు"}
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPageData.pageNumber}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="relative h-[60vh] bg-gray-50 rounded-lg p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div
                className={`prose prose-sm ${showTelugu ? "telugu-text" : ""} max-w-none`}
              >
                {showTelugu && currentPageData.contentTelugu
                  ? currentPageData.contentTelugu
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))
                  : currentPageData.content
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={previewPages.length <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {previewPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentPage
                      ? "bg-blue-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextPage}
              disabled={previewPages.length <= 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">Enjoying this preview?</p>
            <Button className="w-full">
              Buy Complete Book - ₹{book.price}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
