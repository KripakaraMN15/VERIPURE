import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  FileText,
  Info,
  ExternalLink,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Menu,
  X,
  FlaskConical,
  Beaker,
  Microscope,
  CheckSquare,
  ShoppingBag,
  BarChart3,
  Users,
  Target,
  Heart,
  Globe,
  Plus,
  Trash2,
  Loader2,
  Upload,
  Sun,
  Moon,
  Download,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SupplementRecord, TestStatus } from './types';
import { dummyRecords } from './data/dummyRecords';

type View = 'directory' | 'process' | 'labs' | 'about';

const StatusBadge = ({ status }: { status: TestStatus }) => {
  const variants = {
    Pass: "bg-pass/10 text-pass border-pass/20",
    Fail: "bg-fail/10 text-fail border-fail/20",
    Warning: "bg-warning/10 text-warning border-warning/20",
  };

  const icons = {
    Pass: <CheckCircle2 className="w-3 h-3 mr-1" />,
    Fail: <XCircle className="w-3 h-3 mr-1" />,
    Warning: <AlertCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <Badge variant="outline" className={`${variants[status]} font-mono text-[10px] uppercase tracking-wider`}>
      {icons[status]}
      {status}
    </Badge>
  );
};

const ProductDetails = ({ record }: { record: SupplementRecord }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('VERIPURE LAB REPORT', 20, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`REPORT ID: #VP-${record.id.toUpperCase()}`, pageWidth - 20, 25, { align: 'right' });

      // Product Info
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(record.productName, 20, 55);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Brand: ${record.brand}`, 20, 62);
      doc.text(`Category: ${record.category}`, 20, 68);
      doc.text(`Test Date: ${record.testDate}`, 20, 74);

      // Status Summary
      const statusColor = record.overallStatus === 'Pass' ? [16, 185, 129] : record.overallStatus === 'Fail' ? [239, 68, 68] : [245, 158, 11];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(pageWidth - 70, 50, 50, 25, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('OVERALL STATUS', pageWidth - 45, 60, { align: 'center' });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(record.overallStatus.toUpperCase(), pageWidth - 45, 68, { align: 'center' });

      // Detailed Results Table
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(14);
      doc.text('Detailed Analysis', 20, 95);

      autoTable(doc, {
        startY: 100,
        head: [['Parameter', 'Claimed', 'Found', 'Status']],
        body: record.detailedResults.map(res => [
          res.parameter,
          res.claimed,
          res.found,
          res.status
        ]),
        headStyles: { fillColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 100 }
      });

      // Purity Section
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(14);
      doc.text('Purity & Heavy Metals', 20, finalY + 20);

      const metalsData = Object.entries(record.heavyMetals).map(([metal, status]) => [
        metal.charAt(0).toUpperCase() + metal.slice(1),
        status
      ]);

      autoTable(doc, {
        startY: finalY + 25,
        head: [['Metal', 'Status']],
        body: metalsData,
        headStyles: { fillColor: [40, 40, 40] },
        theme: 'grid',
        styles: { halign: 'center' }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          'This report is generated by VeriPure Labs. All tests are conducted in ISO/IEC 17025 certified facilities.',
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      doc.save(`VeriPure_Report_${record.productName.replace(/\s+/g, '_')}.pdf`);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-muted rounded-xl overflow-hidden border border-border">
          <img
            src={record.imageUrl}
            alt={record.productName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{record.brand}</h3>
            <h2 className="text-2xl font-bold tracking-tight">{record.productName}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{record.category}</Badge>
            <StatusBadge status={record.overallStatus} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {record.description}
          </p>
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">TEST DATE</span>
              <span>{record.testDate}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">AMINO SPIKING</span>
              <span className={record.aminoSpiking ? "text-fail" : "text-pass"}>
                {record.aminoSpiking ? "DETECTED" : "NOT DETECTED"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Lab Results</TabsTrigger>
          <TabsTrigger value="purity">Purity & Metals</TabsTrigger>
        </TabsList>
        <TabsContent value="results" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-[10px] uppercase">Parameter</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">Claimed</TableHead>
                <TableHead className="font-mono text-[10px] uppercase">Found</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.detailedResults.map((res, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{res.parameter}</TableCell>
                  <TableCell className="font-mono text-xs">{res.claimed}</TableCell>
                  <TableCell className="font-mono text-xs">{res.found}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={res.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="purity" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(record.heavyMetals).map(([metal, status]) => (
              <div key={metal} className="p-4 border border-border rounded-lg flex flex-col items-center justify-center space-y-2">
                <span className="text-xs font-mono uppercase text-muted-foreground">{metal}</span>
                <StatusBadge status={status as TestStatus} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap justify-end gap-3 pt-4">
        <Button
          variant="outline"
          className="font-mono text-xs"
          onClick={downloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          DOWNLOAD PDF REPORT
        </Button>
        <Button
          variant="outline"
          className="font-mono text-xs"
          nativeButton={false}
          render={<a href={record.labReportUrl} target="_blank" rel="noopener noreferrer" />}
        >
          <FileText className="w-4 h-4 mr-2" />
          VIEW FULL LAB REPORT
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const HeroProcessWidget = () => {
  const steps = [
    { num: '1', title: 'Submit', desc: 'User submits a supplement product for testing.' },
    { num: '2', title: 'Lab Test', desc: 'Independent labs analyze purity, potency, and label accuracy.' },
    { num: '3', title: 'Report', desc: 'Verified results are published on the VeriPure directory.' }
  ];

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-border w-full max-w-[500px] mx-auto lg:mx-0 lg:-ml-4 relative">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + idx * 0.4 }}
          className={`flex relative ${idx !== steps.length - 1 ? 'pb-12' : ''}`}
        >
          {/* Static background line */}
          {idx !== steps.length - 1 && (
            <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-border z-0" />
          )}

          {/* Animated filled line */}
          {idx !== steps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'calc(100% - 48px)' }}
              transition={{ duration: 0.5, delay: 0.6 + idx * 0.4, ease: "easeOut" }}
              className="absolute left-[23px] top-12 w-[2px] bg-foreground z-10"
            />
          )}

          {/* Badge */}
          <div className="w-12 h-12 rounded-full border-2 border-foreground bg-foreground text-background flex items-center justify-center font-bold z-20 flex-shrink-0 text-lg shadow-sm">
            {step.num}
          </div>

          <div className="ml-6 pt-2">
            <h3 className="text-xl font-extrabold uppercase tracking-tight text-foreground">{step.title}</h3>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const DirectoryView = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredRecords,
  categories
}: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-12"
  >
    {/* Hero Section */}
    <section className="relative py-20 lg:py-28 overflow-hidden technical-grid -mx-4 px-6 md:px-12 lg:px-16">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center lg:items-start"
            >
              <Badge variant="outline" className="mb-4 font-mono text-[10px] tracking-[0.2em] uppercase py-1 px-3">
                Independent Verification Platform
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
                TRUST THROUGH <br />
                <span className="text-muted-foreground">TRANSPARENCY.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                VeriPure is an independent testing platform dedicated to verifying the purity,
                potency, and label accuracy of health supplements. We test so you can trust.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-full px-8">
                  Explore Directory
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="relative w-full flex justify-center lg:justify-end mt-8 lg:mt-0">
            <HeroProcessWidget />
          </div>
        </div>
      </div>
    </section>

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search brands or products..."
          className="pl-10 h-12 rounded-xl border-border bg-muted/50 focus:bg-background transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className="rounded-full whitespace-nowrap"
          onClick={() => setSelectedCategory(null)}
        >
          All Products
        </Button>
        {categories.map((cat: string) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>

    {/* Results Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {filteredRecords.map((record: SupplementRecord) => (
          <motion.div
            key={record.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Dialog>
              <DialogTrigger
                nativeButton={false}
                render={<Card className="group cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden border-border bg-card/50 backdrop-blur-sm" />}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={record.imageUrl}
                    alt={record.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4">
                    <StatusBadge status={record.overallStatus} />
                  </div>
                </div>
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{record.brand}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{record.testDate}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">{record.productName}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs mt-2">
                    {record.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0">{record.category}</Badge>
                  </div>
                  <div className="flex items-center text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    VIEW DETAILS <ArrowRight className="ml-1 w-3 h-3" />
                  </div>
                </CardFooter>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-y-auto">
                <ProductDetails record={record} />
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    {filteredRecords.length === 0 && (
      <div className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Search className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-bold">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    )}

    {/* Testimonials Section */}
    <section className="py-20 border-t border-border">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">Community Trust</Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">WHAT THE EXPERTS SAY</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          VeriPure is trusted by thousands of fitness professionals, healthcare providers,
          and conscious consumers worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "Rahul Sharma",
            role: "Elite Fitness Coach",
            text: "VeriPure has completely changed how I recommend supplements to my clients. No more guessing games—we only use products with a verified 'Pass' status.",
            avatar: "RS"
          },
          {
            name: "Dr. Ananya Iyer",
            role: "Clinical Nutritionist",
            text: "The level of transparency VeriPure provides is unprecedented. Being able to download full lab reports for heavy metals is a game-changer for patient safety.",
            avatar: "AI"
          },
          {
            name: "Vikram Singh",
            role: "Professional Athlete",
            text: "As a drug-tested athlete, I can't afford to take risks with contaminated supplements. VeriPure gives me the peace of mind I need to focus on my performance.",
            avatar: "VS"
          }
        ].map((t, i) => (
          <Card key={i} className="border-border bg-muted/30 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <Quote className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />
            <CardContent className="pt-8 space-y-6">
              <p className="text-lg italic leading-relaxed text-foreground/80">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </motion.div>
);

const ProcessView = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto space-y-16 py-12"
  >
    <div className="text-center space-y-4">
      <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">Methodology</Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">OUR VERIFICATION PROCESS</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        We follow a rigorous, multi-stage testing protocol to ensure that every product
        in our directory meets the highest standards of purity and accuracy.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-12">
      {[
        {
          step: "01",
          title: "Blind Sampling",
          icon: <ShoppingBag className="w-8 h-8" />,
          description: "We don't accept samples from brands. Instead, we purchase products anonymously from retail stores and online marketplaces, just like a regular consumer would. This ensures the products we test are exactly what you buy.",
          details: ["Anonymous purchasing", "Retail-sourced samples", "Batch number tracking"]
        },
        {
          step: "02",
          title: "Laboratory Analysis",
          icon: <FlaskConical className="w-8 h-8" />,
          description: "Samples are sent to our ISO/IEC 17025 accredited partner laboratories. We perform comprehensive testing including protein content verification, amino spiking detection, and heavy metal screening.",
          details: ["ISO/IEC 17025 Accreditation", "Double-blind testing", "State-of-the-art equipment"]
        },
        {
          step: "03",
          title: "Data Verification",
          icon: <BarChart3 className="w-8 h-8" />,
          description: "Our team of experts reviews the raw lab data against the product's label claims. We calculate the accuracy percentage and check for any contaminants or banned substances.",
          details: ["Expert review", "Label accuracy calculation", "Purity verification"]
        },
        {
          step: "04",
          title: "Publishing & Transparency",
          icon: <CheckSquare className="w-8 h-8" />,
          description: "We publish the findings in our directory, assigning a Pass, Fail, or Warning status. The full lab report is made available to the public for complete transparency.",
          details: ["Public directory", "Full lab reports", "Real-time updates"]
        }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-mono text-2xl font-bold">
            {item.step}
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg text-primary">{item.icon}</div>
              <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {item.description}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {item.details.map((detail, dIdx) => (
                <li key={dIdx} className="flex items-center text-sm font-mono text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const LabsView = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto space-y-16 py-12"
  >
    <div className="text-center space-y-4">
      <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">Infrastructure</Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">LABORATORY NETWORK</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        We partner with world-class, independent laboratories to ensure the highest
        precision and unbiased results in our testing.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        {
          name: "VeriPure Central Lab",
          location: "Mumbai, India",
          specialty: "Supplement Purity & Protein Analysis",
          accreditation: "ISO/IEC 17025:2017",
          description: "Our flagship facility equipped with advanced HPLC and LC-MS/MS systems for high-precision chemical analysis."
        },
        {
          name: "Eurofins Scientific Partner",
          location: "Global Network",
          specialty: "Contaminants & Heavy Metals",
          accreditation: "NABL / ISO 17025",
          description: "A global leader in food and supplement testing, providing specialized analysis for heavy metals and pesticides."
        },
        {
          name: "Analytical Research Lab",
          location: "Bangalore, India",
          specialty: "Microbiological Testing",
          accreditation: "ISO 17025",
          description: "Specialized in identifying harmful bacteria, mold, and other biological contaminants in powdered supplements."
        },
        {
          name: "Precision Bio-Chem",
          location: "Hyderabad, India",
          specialty: "Amino Acid Profiling",
          accreditation: "ISO 17025",
          description: "Experts in identifying amino spiking through detailed amino acid profile mapping and comparison."
        }
      ].map((lab, idx) => (
        <Card key={idx} className="border-border bg-card/50 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="bg-muted/30 border-b border-border">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{lab.name}</CardTitle>
                <CardDescription className="font-mono text-[10px] mt-1 uppercase tracking-wider">{lab.location}</CardDescription>
              </div>
              <Microscope className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Specialty</span>
              <p className="text-sm font-medium">{lab.specialty}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Accreditation</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-pass/5 text-pass border-pass/20">{lab.accreditation}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lab.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Interested in partnering?</h2>
      <p className="text-primary-foreground/70 max-w-xl mx-auto">
        We are always looking to expand our network of certified, independent laboratories.
        If your lab meets our criteria, we'd love to hear from you.
      </p>
      <Button variant="secondary" size="lg" className="rounded-full px-8">
        Contact Lab Relations
      </Button>
    </div>
  </motion.div>
);

const AboutView = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto space-y-20 py-12"
  >
    <div className="text-center space-y-4">
      <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">Our Mission</Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">WE TEST SO YOU CAN TRUST.</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        VeriPure was founded with a single goal: to bring absolute transparency to the
        supplement industry and protect consumers from fraud.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Independence",
          icon: <ShieldCheck className="w-8 h-8" />,
          description: "We are 100% independent. We do not accept sponsorships from supplement brands."
        },
        {
          title: "Accuracy",
          icon: <Target className="w-8 h-8" />,
          description: "We use only ISO-certified laboratories and rigorous testing protocols."
        },
        {
          title: "Transparency",
          icon: <Globe className="w-8 h-8" />,
          description: "Every test result and lab report is published for free to the public."
        }
      ].map((item, idx) => (
        <div key={idx} className="text-center space-y-4 p-6 border border-border rounded-3xl bg-muted/30">
          <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <div className="text-primary">{item.icon}</div>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>

    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">The Problem We're Solving</h2>
          <p className="text-muted-foreground leading-relaxed">
            The supplement industry is largely self-regulated. This has led to widespread
            issues like amino spiking, heavy metal contamination, and major label inaccuracies.
            Consumers often pay for high-quality protein but receive cheap fillers instead.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            VeriPure acts as a third-party watchdog, providing the data you need to make
            informed decisions about your health and your wallet.
          </p>
        </div>
        <div className="aspect-video bg-muted rounded-3xl overflow-hidden border border-border relative">
          <img 
            src="/lab-image.jpg" 
            alt="Advanced laboratory testing equipment" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <div className="text-center space-y-8 py-12 border-t border-border">
      <h2 className="text-3xl font-bold tracking-tight">Our Commitment to You</h2>
      <div className="flex flex-wrap justify-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-bold tracking-tighter">100%</span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Unbiased</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-bold tracking-tighter">500+</span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Tests Done</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-bold tracking-tighter">ISO</span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Certified Labs</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<View>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [records] = useState<SupplementRecord[]>(dummyRecords);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch =
        record.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || record.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, records]);

  const categories = ['Whey Protein', 'Creatine', 'Multivitamin', 'Pre-Workout'];

  const renderView = () => {
    switch (currentView) {
      case 'directory':
        return (
          <DirectoryView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredRecords={filteredRecords}
            categories={categories}
          />
        );
      case 'process':
        return <ProcessView />;
      case 'labs':
        return <LabsView />;
      case 'about':
        return <AboutView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentView('directory')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter">VERIPURE</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => setCurrentView('directory')}
              className={`hover:text-primary transition-colors ${currentView === 'directory' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Directory
            </button>
            <button
              onClick={() => setCurrentView('process')}
              className={`hover:text-primary transition-colors ${currentView === 'process' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Our Process
            </button>
            <button
              onClick={() => setCurrentView('labs')}
              className={`hover:text-primary transition-colors ${currentView === 'labs' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Labs
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`hover:text-primary transition-colors ${currentView === 'about' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              About
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-20 px-4"
          >
            <div className="flex flex-col space-y-6 text-2xl font-bold">
              <button onClick={() => { setCurrentView('directory'); setIsMenuOpen(false); }}>Directory</button>
              <button onClick={() => { setCurrentView('process'); setIsMenuOpen(false); }}>Our Process</button>
              <button onClick={() => { setCurrentView('labs'); setIsMenuOpen(false); }}>Labs</button>
              <button onClick={() => { setCurrentView('about'); setIsMenuOpen(false); }}>About</button>
              <Separator />
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-3 text-left"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-6 h-6" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-6 h-6" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:col-span-4 lg:grid-cols-4 gap-12">
            <div className="col-span-1 lg:col-span-2">
              <div
                className="flex items-center space-x-2 mb-6 cursor-pointer"
                onClick={() => setCurrentView('directory')}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-primary-foreground w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tighter">VERIPURE</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                The world's most trusted independent supplement verification platform.
                We use state-of-the-art laboratory testing to ensure what's on the label is in the bottle.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><button onClick={() => setCurrentView('directory')} className="hover:text-primary transition-colors">Product Directory</button></li>
                <li><button onClick={() => setCurrentView('process')} className="hover:text-primary transition-colors">Testing Process</button></li>
                <li><button onClick={() => setCurrentView('labs')} className="hover:text-primary transition-colors">Lab Partners</button></li>
                <li><button onClick={() => setCurrentView('about')} className="hover:text-primary transition-colors">Certification</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><button onClick={() => setCurrentView('about')} className="hover:text-primary transition-colors">About Us</button></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
            <p>© 2026 VERIPURE LABS. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-8">
              <span>ISO/IEC 17025 CERTIFIED</span>
              <span>INDEPENDENT & UNBIASED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
