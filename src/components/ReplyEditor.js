import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from '../contexts/AuthContext';
import { sendReply } from '../services/api';

const EditorContainer = styled.div`
  margin-top: 24px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--background-light);
`;

const EditorHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--gray-light);
`;

const RecipientField = styled.div`
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 8px;
`;

const Value = styled.span`
  color: var(--text-secondary);
`;

const SubjectField = styled.div`
  margin-bottom: 8px;
`;

const EditorContent = styled.div`
  .quill {
    background-color: var(--background-light);
    
    .ql-toolbar {
      border-bottom: 1px solid var(--border-color);
      background-color: var(--gray-light);
    }
    
    .ql-container {
      min-height: 200px;
      font-size: 16px;
      
      .ql-editor {
        min-height: 200px;
        color: var(--text-primary);
      }
    }
  }
`;

const EditorFooter = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  background-color: var(--gray-light);
`;

const SendButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 12px;
  
  &:hover {
    background-color: var(--gray-light);
  }
`;

const CustomButton = styled.button`
  background-color: ${props => props.primary ? 'var(--success-color)' : 'var(--warning-color)'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 12px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VariablesDropdown = styled.select`
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-light);
  color: var(--text-primary);
  margin-right: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;

const CustomToolbar = styled.div`
  display: flex;
  padding: 8px;
  background-color: var(--gray-light);
  border-bottom: 1px solid var(--border-color);
`;

const VariableButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const VariableButton = styled.button`
  background-color: var(--primary-light);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const SavedMessage = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
  border-radius: 4px;
  font-size: 14px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'link', 'image'
];

const ReplyEditor = ({ threadId, to, subject, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const quillRef = useRef(null);
  
  const variables = [
    { id: 'name', label: 'Name', value: '{{name}}' },
    { id: 'email', label: 'Email', value: '{{email}}' },
    { id: 'company', label: 'Company', value: '{{company}}' },
    { id: 'date', label: 'Current Date', value: '{{date}}' },
    { id: 'signature', label: 'Signature', value: '{{signature}}' },
    { id: 'greeting', label: 'Greeting', value: '{{greeting}}' },
    { id: 'regards', label: 'Regards', value: '{{regards}}' }
  ];
  
  const handleSend = async () => {
    if (!content.trim()) return;
    
    setIsSending(true);
    try {
      const replyData = {
        from: user?.user?.email || 'me@example.com',
        to: to,
        subject: subject,
        body: content
      };
      
      await sendReply(threadId, replyData);
      onCancel(); // Close editor after successful send
    } catch (error) {
      console.error('Error sending reply:', error);
      // In a real app, show error message to user
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSave = () => {
    // In a real implementation, this would save the draft
    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
    
    // Save to localStorage for this example
    localStorage.setItem(`draft_${threadId}`, content);
  };
  
  const toggleVariablesSection = () => {
    setShowVariables(!showVariables);
  };
  
  const insertVariable = (variableValue) => {
    if (!quillRef.current) return;
    
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    const position = range ? range.index : 0;
    
    editor.insertText(position, ` ${variableValue} `);
    editor.setSelection(position + variableValue.length + 2);
  };
  
  return (
    <EditorContainer>
      <EditorHeader>
        <RecipientField>
          <Label>To:</Label>
          <Value>{to}</Value>
        </RecipientField>
        <SubjectField>
          <Label>Subject:</Label>
          <Value>{subject}</Value>
        </SubjectField>
      </EditorHeader>
      
      <CustomToolbar>
        <ButtonGroup>
          <CustomButton primary onClick={handleSave}>SAVE</CustomButton>
          <CustomButton onClick={toggleVariablesSection}>
            {showVariables ? 'Hide Variables' : 'Show Variables'}
          </CustomButton>
        </ButtonGroup>
        <SavedMessage show={showSavedMessage}>Draft saved successfully!</SavedMessage>
      </CustomToolbar>
      
      {showVariables && (
        <VariableButtonsContainer>
          {variables.map(variable => (
            <VariableButton 
              key={variable.id}
              onClick={() => insertVariable(variable.value)}
            >
              {variable.label}
            </VariableButton>
          ))}
        </VariableButtonsContainer>
      )}
      
      <EditorContent>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Write your reply here..."
        />
      </EditorContent>
      
      <EditorFooter>
        <ButtonGroup>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
        </ButtonGroup>
        <SendButton onClick={handleSend} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </SendButton>
      </EditorFooter>
    </EditorContainer>
  );
};

export default ReplyEditor; 