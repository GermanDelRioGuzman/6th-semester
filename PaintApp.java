import java.util.ArrayList;
import java.util.List;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import javax.swing.*;

public class PaintApp {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(PaintApp::new);
    }

    enum Tool {
        PENCIL, RECTANGLE, OVAL, ARC, ERASER
    }

    private static final Color[] COLOR_PALLETE = {
        Color.black, Color.darkGray, Color.gray, Color.lightGray,
        Color.red, Color.green, Color.blue, Color.yellow,
        Color.orange, Color.cyan, Color.magenta, Color.pink, Color.white
    };

    class ColoredShape {
        Shape shape;
        Color color;

        public ColoredShape(Shape shape, Color color) {
            this.shape = shape;
            this.color = color;
        }
    }

    class DrawingPanel extends JPanel {
        private List<ColoredShape> shapes = new ArrayList<>();
        private ColoredShape currentShape;
        private Point startPoint;
        private Tool currentTool = Tool.PENCIL;
        private Color currentColor = Color.black;

        public void setCurrentTool(Tool tool) {
            this.currentTool = tool;
        }

        public void setCurrentColor(Color color) {
            this.currentColor = color;
        }

        public DrawingPanel() {
            setBackground(Color.white);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    startPoint = e.getPoint();
                }

                @Override
                public void mouseReleased(MouseEvent e) {
                    if (currentShape != null) {
                        shapes.add(currentShape);
                        currentShape = null;
                        repaint();
                    }
                }
            });

            addMouseMotionListener(new MouseAdapter() {
                @Override
                public void mouseDragged(MouseEvent e) {
                    Point endPoint = e.getPoint();
                    Shape shape = null;

                    switch (currentTool) {
                        case PENCIL:
                            shape = new Line2D.Double(startPoint, endPoint);
                            shapes.add(new ColoredShape(shape, currentColor));
                            startPoint = endPoint;
                            break;
                        case RECTANGLE:
                            shape = new Rectangle2D.Double(
                                Math.min(startPoint.x, endPoint.x),
                                Math.min(startPoint.y, endPoint.y),
                                Math.abs(endPoint.x - startPoint.x),
                                Math.abs(endPoint.y - startPoint.y)
                            );
                            currentShape = new ColoredShape(shape, currentColor);
                            break;
                        case OVAL:
                            shape = new Ellipse2D.Double(
                                Math.min(startPoint.x, endPoint.x),
                                Math.min(startPoint.y, endPoint.y),
                                Math.abs(endPoint.x - startPoint.x),
                                Math.abs(endPoint.y - startPoint.y)
                            );
                            currentShape = new ColoredShape(shape, currentColor);
                            break;
                        case ARC:
                            shape = new Arc2D.Double(
                                Math.min(startPoint.x, endPoint.x),
                                Math.min(startPoint.y, endPoint.y),
                                Math.abs(endPoint.x - startPoint.x),
                                Math.abs(endPoint.y - startPoint.y),
                                0, 180, Arc2D.OPEN
                            );
                            currentShape = new ColoredShape(shape, currentColor);
                            break;
                        case ERASER:
                            shape = new Line2D.Double(startPoint, endPoint);
                            shapes.add(new ColoredShape(shape, Color.white));
                            startPoint = endPoint;
                            break;
                    }

                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;

            for (ColoredShape cs : shapes) {
                g2d.setColor(cs.color);
                g2d.draw(cs.shape);
            }

            if (currentShape != null) {
                g2d.setColor(currentShape.color);
                g2d.draw(currentShape.shape);
            }
        }
    }

    public PaintApp() {
        JFrame frame = new JFrame("Java Paint App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        DrawingPanel drawingPanel = new DrawingPanel();
        frame.add(drawingPanel, BorderLayout.CENTER);

        JPanel toolPanel = new JPanel();
        ButtonGroup toolGroup = new ButtonGroup();

        addToolButton(toolPanel, toolGroup, "Pencil", Tool.PENCIL, drawingPanel);
        addToolButton(toolPanel, toolGroup, "Rectangle", Tool.RECTANGLE, drawingPanel);
        addToolButton(toolPanel, toolGroup, "Oval", Tool.OVAL, drawingPanel);
        addToolButton(toolPanel, toolGroup, "Arc", Tool.ARC, drawingPanel);
        addToolButton(toolPanel, toolGroup, "Eraser", Tool.ERASER, drawingPanel);

        for (Color color : COLOR_PALLETE) {
            JPanel colorPanel = new JPanel();
            colorPanel.setBackground(color);
            colorPanel.setPreferredSize(new Dimension(30, 30));
            colorPanel.setToolTipText(color.toString());
            colorPanel.addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    drawingPanel.setCurrentColor(color);
                }
            });
            toolPanel.add(colorPanel);
        }

        frame.add(toolPanel, BorderLayout.NORTH);
        frame.setSize(800, 600);
        frame.setVisible(true);
    }

    private void addToolButton(JPanel panel, ButtonGroup group, String label, Tool tool, DrawingPanel drawingPanel) {
        JToggleButton btn = new JToggleButton(label);
        btn.addActionListener(e -> drawingPanel.setCurrentTool(tool));
        group.add(btn);
        panel.add(btn);

        if (tool == Tool.PENCIL) {
            btn.setSelected(true); // default selected tool
        }
    }
}
