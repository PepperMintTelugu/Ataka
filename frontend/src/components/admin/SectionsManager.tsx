import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  ImageIcon,
  Users,
  Building2,
  Star,
  BarChart3,
  Mail,
} from "lucide-react";

interface HomepageSection {
  id: string;
  type: string;
  title?: string;
  titleTelugu?: string;
  subtitle?: string;
  subtitleTelugu?: string;
  isActive: boolean;
  order: number;
  settings: any;
}

interface SectionsManagerProps {
  sections: HomepageSection[];
  onUpdate: (sections: HomepageSection[]) => void;
  onReorder: (result: DropResult) => void;
}

const sectionTypeInfo = {
  hero: {
    name: "Hero Slider",
    icon: ImageIcon,
    description: "Main banner slider with images and content",
    color: "bg-blue-500",
  },
  categories: {
    name: "Categories",
    icon: BarChart3,
    description: "Featured categories display",
    color: "bg-green-500",
  },
  authors: {
    name: "Authors",
    icon: Users,
    description: "Featured authors carousel",
    color: "bg-purple-500",
  },
  publishers: {
    name: "Publishers",
    icon: Building2,
    description: "Featured publishers showcase",
    color: "bg-orange-500",
  },
  stats: {
    name: "Statistics",
    icon: BarChart3,
    description: "Site statistics and numbers",
    color: "bg-indigo-500",
  },
  features: {
    name: "Why Choose Us",
    icon: Star,
    description: "Key features and benefits",
    color: "bg-yellow-500",
  },
  newsletter: {
    name: "Newsletter",
    icon: Mail,
    description: "Newsletter subscription form",
    color: "bg-red-500",
  },
};

export default function SectionsManager({
  sections,
  onUpdate,
  onReorder,
}: SectionsManagerProps) {
  const toggleSection = (sectionId: string) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, isActive: !section.isActive }
        : section,
    );
    onUpdate(updatedSections);
  };

  const addSection = (type: string) => {
    const newSection: HomepageSection = {
      id: `section-${Date.now()}`,
      type,
      title:
        sectionTypeInfo[type as keyof typeof sectionTypeInfo]?.name || type,
      titleTelugu: "",
      subtitle: "",
      subtitleTelugu: "",
      isActive: true,
      order: sections.length + 1,
      settings: {},
    };

    onUpdate([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index + 1 }));
    onUpdate(updatedSections);
  };

  const availableSectionTypes = Object.keys(sectionTypeInfo).filter(
    (type) => !sections.some((section) => section.type === type),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Homepage Sections Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Drag and drop to reorder sections. Toggle visibility or remove
            sections as needed.
          </p>
        </CardHeader>
        <CardContent>
          {/* Add New Section */}
          {availableSectionTypes.length > 0 && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Add New Section
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSectionTypes.map((type) => {
                  const info =
                    sectionTypeInfo[type as keyof typeof sectionTypeInfo];
                  const Icon = info.icon;
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => addSection(type)}
                      className="flex items-center justify-start h-auto p-3"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium text-xs">{info.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {info.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sections List */}
          <DragDropContext onDragEnd={onReorder}>
            <Droppable droppableId="sections">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 ${
                    snapshot.isDraggingOver ? "bg-blue-50 rounded-lg p-2" : ""
                  }`}
                >
                  {sections.map((section, index) => {
                    const info =
                      sectionTypeInfo[
                        section.type as keyof typeof sectionTypeInfo
                      ];
                    const Icon = info?.icon || BarChart3;

                    return (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg p-4 ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-200"
                                : ""
                            } ${
                              !section.isActive ? "opacity-50" : ""
                            } transition-all`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>

                                {/* Section Info */}
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-lg ${
                                      info?.color || "bg-gray-500"
                                    } flex items-center justify-center text-white`}
                                  >
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-medium text-gray-900">
                                        {section.title ||
                                          info?.name ||
                                          "Section"}
                                      </h3>
                                      <Badge
                                        variant={
                                          section.isActive
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {section.isActive ? "Active" : "Hidden"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {info?.description ||
                                        "Custom homepage section"}
                                    </p>
                                    {section.titleTelugu && (
                                      <p className="text-sm text-gray-600">
                                        {section.titleTelugu}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex items-center space-x-2">
                                {/* Order Number */}
                                <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                  #{section.order}
                                </div>

                                {/* Visibility Toggle */}
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={section.isActive}
                                    onCheckedChange={() =>
                                      toggleSection(section.id)
                                    }
                                  />
                                  {section.isActive ? (
                                    <Eye className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>

                                {/* Edit Button */}
                                <Button variant="ghost" size="sm">
                                  <Edit3 className="w-4 h-4" />
                                </Button>

                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSection(section.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Section Settings Preview */}
                            {section.subtitle && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-gray-600">
                                  {section.subtitle}
                                </p>
                                {section.subtitleTelugu && (
                                  <p className="text-sm text-gray-600">
                                    {section.subtitleTelugu}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {sections.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No sections configured</p>
              <p className="text-sm">
                Add sections above to start building your homepage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Available Section Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sectionTypeInfo).map(([type, info]) => {
              const Icon = info.icon;
              const isUsed = sections.some((section) => section.type === type);

              return (
                <div
                  key={type}
                  className={`p-4 border rounded-lg ${
                    isUsed ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center text-white`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{info.name}</h4>
                      <p className="text-sm text-gray-500">
                        {info.description}
                      </p>
                      {isUsed && (
                        <Badge variant="secondary" className="mt-1">
                          In Use
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
