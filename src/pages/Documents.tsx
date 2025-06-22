
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Upload, 
  FileText, 
  Download, 
  Eye,
  Filter,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  project: string;
  category: string;
  author: string;
}

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const documents: Document[] = [
    {
      id: 1,
      name: 'Spécifications_Technique_5G.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-20',
      project: 'Migration Core Network 5G',
      category: 'Technique',
      author: 'Ahmed Bennani'
    },
    {
      id: 2,
      name: 'Architecture_IoT_Platform.docx',
      type: 'docx',
      size: '1.8 MB',
      uploadDate: '2024-02-15',
      project: 'Déploiement IoT Platform',
      category: 'Architecture',
      author: 'Fatima Zahra'
    },
    {
      id: 3,
      name: 'Budget_CRM_2024.xlsx',
      type: 'xlsx',
      size: '856 KB',
      uploadDate: '2024-03-10',
      project: 'Upgrade CRM System',
      category: 'Budget',
      author: 'Omar Alami'
    },
    {
      id: 4,
      name: 'Audit_Sécurité_Réseau.pdf',
      type: 'pdf',
      size: '3.2 MB',
      uploadDate: '2024-04-05',
      project: 'Sécurisation Infrastructure',
      category: 'Sécurité',
      author: 'Laila Benali'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx': return <File className="h-8 w-8 text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case 'jpg':
      case 'png': return <Image className="h-8 w-8 text-purple-500" />;
      default: return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technique': return 'bg-blue-100 text-blue-800';
      case 'Architecture': return 'bg-purple-100 text-purple-800';
      case 'Budget': return 'bg-green-100 text-green-800';
      case 'Sécurité': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesProject = projectFilter === 'all' || doc.project === projectFilter;

    return matchesSearch && matchesCategory && matchesProject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion Documentaire</h1>
          <p className="text-gray-600">Centralisation et organisation des documents projets</p>
        </div>
        <Button className="bg-inwi-gradient">
          <Upload className="h-4 w-4 mr-2" />
          Importer Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 text-inwi-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{documents.filter(d => d.type === 'pdf').length}</p>
                <p className="text-sm text-gray-600">PDF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <File className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{documents.filter(d => d.type === 'docx').length}</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{documents.filter(d => d.type === 'xlsx').length}</p>
                <p className="text-sm text-gray-600">Tableurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <SelectItem value="Technique">Technique</SelectItem>
                <SelectItem value="Architecture">Architecture</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Sécurité">Sécurité</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous projets</SelectItem>
                <SelectItem value="Migration Core Network 5G">Migration Core Network 5G</SelectItem>
                <SelectItem value="Déploiement IoT Platform">Déploiement IoT Platform</SelectItem>
                <SelectItem value="Upgrade CRM System">Upgrade CRM System</SelectItem>
                <SelectItem value="Sécurisation Infrastructure">Sécurisation Infrastructure</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getFileIcon(doc.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{doc.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                      <Badge variant="outline">{doc.project}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
