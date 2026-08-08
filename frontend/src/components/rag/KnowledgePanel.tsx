"use client";

import { useState } from "react";
import { KnowledgeSource, KnowledgeConcept } from "@/types/knowledge";
import { retrieveClinicalKnowledgeMock } from "@/lib/api/rag";
import { KnowledgeSourceCard } from "@/components/rag/KnowledgeSourceCard";
import { KnowledgeGraph } from "@/components/rag/KnowledgeGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Search, Loader2, Network, ArrowRight } from "lucide-react";

export function KnowledgePanel() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [concepts, setConcepts] = useState<KnowledgeConcept[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await retrieveClinicalKnowledgeMock(query);
      // Normalize scores for display to out of 100
      setSources(results.sources.map(s => ({...s, relevanceScore: s.relevanceScore > 1 ? s.relevanceScore / 100 : s.relevanceScore })));
      setConcepts(results.concepts);
    } catch (error) {
      console.error("Failed to retrieve knowledge", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <Card className="border-border bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Clinical Knowledge Retrieval
            </span>
            {hasSearched && !isSearching && (
              <span className="text-xs font-semibold bg-safe/10 text-safe px-2 py-1 rounded-full border border-safe/20">
                Completed
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clinical guidelines, protocols, and references..." 
                className="pl-9 bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Retrieve"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSearching && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card/30 border border-border rounded-xl">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="font-medium">Retrieving relevant clinical sources...</p>
          <p className="text-sm text-muted-foreground mt-1">Querying vector database and ranking knowledge.</p>
        </div>
      )}

      {hasSearched && !isSearching && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sources List */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center justify-between">
                Knowledge Sources
                <span className="text-sm font-normal text-muted-foreground">{sources.length} retrieved</span>
              </h3>
              
              {sources.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No relevant clinical knowledge found.</p>
                </div>
              ) : (
                <div className="space-y-3 pr-2 max-h-[500px] overflow-y-auto">
                  {sources.map(source => (
                    <KnowledgeSourceCard key={source.id} source={source} />
                  ))}
                </div>
              )}
            </div>

            {/* Knowledge Graph */}
            <div className="space-y-4">
               <h3 className="font-semibold flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                Knowledge Graph
              </h3>
              {concepts.length > 0 ? (
                <KnowledgeGraph concepts={concepts} />
              ) : (
                <div className="p-8 text-center border border-border bg-card/30 rounded-xl h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Knowledge relationships unavailable.</p>
                </div>
              )}
            </div>
          </div>

          {/* Explainability Pipeline */}
          {sources.length > 0 && (
            <Card className="border-border bg-muted/20">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-4 text-center">How Knowledge Supported This Decision</h4>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
                  <div className="px-3 py-1.5 bg-card border border-border rounded-md shadow-sm">Patient Evidence</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                  <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary font-medium rounded-md shadow-sm">RAG Retrieval</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                  <div className="px-3 py-1.5 bg-card border border-border rounded-md shadow-sm">Guideline Applied</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                  <div className="px-3 py-1.5 bg-safe/10 border border-safe/20 text-safe font-medium rounded-md shadow-sm">AI Recommendation</div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}
    </div>
  );
}
