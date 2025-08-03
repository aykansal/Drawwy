"use client";

import React, { useEffect, useState, useMemo } from "react";
import { fetchAllDrawwyTransactions } from "../../lib/utils";
import { TransactionNode } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Search, User, Image as ImageIcon } from "lucide-react";
import Pagination from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 50;

const DisplayArts = () => {
  const [allTransactions, setAllTransactions] = useState<TransactionNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getArtistName = (tags: { name: string; value: string }[]) => {
    const artistTag = tags.find((tag) => tag.name === "Artist");
    return artistTag ? artistTag.value : "Unknown Artist";
  };

  const getArtworkName = (tags: { name: string; value: string }[]) => {
    const nameTag = tags.find((tag) => tag.name === "Art-Name");
    return nameTag ? nameTag.value : "untitled";
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching all Drawwy transactions...");

      const responses = await fetchAllDrawwyTransactions(100);
      console.log("[display-art-38] Drawwy transactions fetched");

      // Flatten all transactions from all pages
      const allTransactionNodes: TransactionNode[] = [];
      responses.forEach(response => {
        const transactionNodes = response.transactions.edges.map(
          (edge) => edge.node
        );
        allTransactionNodes.push(...transactionNodes);
      });

      console.log(`Total transactions fetched: ${allTransactionNodes.length}`);
      setAllTransactions(allTransactionNodes);
      setCurrentPage(1); // Reset to first page when new data is loaded
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) {
      return allTransactions;
    }

    return allTransactions.filter((transaction) => {
      const artistName = getArtistName(transaction.tags);
      const artworkName = getArtworkName(transaction.tags);

      const searchLower = searchQuery.toLowerCase();
      return (
        artistName.toLowerCase().includes(searchLower) ||
        artworkName.toLowerCase().includes(searchLower)
      );
    });
  }, [allTransactions, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <div className="text-lg text-gray-600">
            Loading community collections...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">Error: {error}</div>
          <Button onClick={fetchTransactions} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="font-nunito text-3xl font-bold text-gray-900">
            Community Showcase
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Discover amazing artwork from the Drawwy community.
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by artist name or artwork title..."
              className="pl-10 pr-4 py-3 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          {filteredTransactions.length === 0 && searchQuery
            ? "No results found"
            : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredTransactions.length)} of ${filteredTransactions.length} artwork${
                filteredTransactions.length !== 1 ? "s" : ""
              }`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentPageTransactions.map((transaction) => {
          const artistName = getArtistName(transaction.tags);
          const artworkName = getArtworkName(transaction.tags);
          const imageUrl = `https://arweave.net/${transaction.id}`;

          return (
            <Card
              key={transaction.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-gray-200"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={artworkName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log("Image failed to load:", imageUrl);
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center bg-gray-200">
                  <div className="text-center space-y-2">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                    <span className="text-gray-500 text-sm">
                      Image not available
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3
                    className="font-semibold text-gray-900 truncate text-sm"
                    title={artworkName}
                  >
                    {artworkName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <p
                      className="text-xs text-gray-600 truncate"
                      title={artistName}
                    >
                      {artistName}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs"
                  variant="outline"
                  onClick={() => window.open(imageUrl, "_blank")}
                >
                  View on permaweb
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination Component */}
      {filteredTransactions.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      )}

      {filteredTransactions.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              No collections found
            </h3>
            <p className="text-gray-600">
              Try refreshing the page or check back later.
            </p>
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <Search className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              No results found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all collections.
            </p>
            <Button
              onClick={() => handleSearchChange("")}
              variant="outline"
              size="sm"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayArts;
