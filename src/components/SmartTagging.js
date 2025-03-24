import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTag, FiClock, FiAlertCircle, FiBriefcase, FiFile } from 'react-icons/fi';

const TagContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border: 1px solid var(--primary-light);
  border-radius: 8px;
  background-color: var(--primary-light);
`;

const TagHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  svg {
    margin-right: 8px;
    color: var(--primary-color);
  }
`;

const TagTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${props => {
    switch(props.type) {
      case 'urgent': return 'rgba(244, 67, 54, 0.1)';
      case 'work': return 'rgba(33, 150, 243, 0.1)';
      case 'personal': return 'rgba(76, 175, 80, 0.1)';
      case 'document': return 'rgba(255, 193, 7, 0.1)';
      default: return 'rgba(158, 158, 158, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'urgent': return 'rgba(244, 67, 54, 0.3)';
      case 'work': return 'rgba(33, 150, 243, 0.3)';
      case 'personal': return 'rgba(76, 175, 80, 0.3)';
      case 'document': return 'rgba(255, 193, 7, 0.3)';
      default: return 'rgba(158, 158, 158, 0.3)';
    }
  }};
  border-radius: 16px;
  color: ${props => {
    switch(props.type) {
      case 'urgent': return '#F44336';
      case 'work': return '#2196F3';
      case 'personal': return '#4CAF50';
      case 'document': return '#FFC107';
      default: return '#9E9E9E';
    }
  }};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  
  svg {
    margin-right: 4px;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const ApplyButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  
  &:hover {
    opacity: 0.9;
  }
`;

// Function to analyze email content and suggest relevant tags
const analyzeEmailContent = (subject, body) => {
  const tags = [];
  const lowerSubject = subject.toLowerCase();
  const lowerBody = body.toLowerCase();
  
  // Look for urgent keywords
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'deadline', 'critical'];
  if (urgentKeywords.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
    tags.push({ id: 'urgent', name: 'Urgent', type: 'urgent', icon: <FiAlertCircle /> });
  }
  
  // Look for work-related keywords
  const workKeywords = ['meeting', 'project', 'report', 'client', 'deadline', 'task', 'team'];
  if (workKeywords.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
    tags.push({ id: 'work', name: 'Work', type: 'work', icon: <FiBriefcase /> });
  }
  
  // Look for document-related keywords
  const documentKeywords = ['document', 'file', 'attachment', 'pdf', 'report', 'presentation', 'spreadsheet'];
  if (documentKeywords.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
    tags.push({ id: 'document', name: 'Document', type: 'document', icon: <FiFile /> });
  }
  
  // Look for follow-up keywords
  const followUpKeywords = ['follow up', 'followup', 'check back', 'reminder', 'get back'];
  if (followUpKeywords.some(keyword => lowerSubject.includes(keyword) || lowerBody.includes(keyword))) {
    tags.push({ id: 'followup', name: 'Follow Up', type: 'personal', icon: <FiClock /> });
  }
  
  return tags;
};

const SmartTagging = ({ subject, body, onApplyTags }) => {
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  useEffect(() => {
    // Analyze the email content to suggest tags
    const tags = analyzeEmailContent(subject, body);
    setSuggestedTags(tags);
  }, [subject, body]);
  
  const toggleTag = (tagId) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter(id => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
  };
  
  const handleApplyTags = () => {
    const tagsToApply = suggestedTags.filter(tag => selectedTags.includes(tag.id));
    onApplyTags(tagsToApply);
  };
  
  // Don't render if no tags are suggested
  if (suggestedTags.length === 0) {
    return null;
  }
  
  return (
    <TagContainer>
      <TagHeader>
        <FiTag />
        <TagTitle>Smart Tags Suggestions</TagTitle>
      </TagHeader>
      
      <TagList>
        {suggestedTags.map(tag => (
          <Tag 
            key={tag.id} 
            type={tag.type}
            onClick={() => toggleTag(tag.id)}
            style={{ 
              opacity: selectedTags.includes(tag.id) ? 1 : 0.6,
              fontWeight: selectedTags.includes(tag.id) ? 600 : 500
            }}
          >
            {tag.icon}
            {tag.name}
          </Tag>
        ))}
      </TagList>
      
      {selectedTags.length > 0 && (
        <ApplyButton onClick={handleApplyTags}>
          Apply Tags
        </ApplyButton>
      )}
    </TagContainer>
  );
};

export default SmartTagging; 